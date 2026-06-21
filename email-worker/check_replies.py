"""
============================================================
SteelNest 自动询盘邮件系统 — 收件检查模块
============================================================
IMAP 登录邮箱 → 搜索供应商回复 → 提取正文 → 记录到 inquiries.json

用法：
    python check_replies.py           # 检查所有未读回复
    python check_replies.py --all     # 检查最近30天所有回复
============================================================
"""

import json
import imaplib
import email
import argparse
import datetime
from email.header import decode_header
from pathlib import Path
from typing import Optional

from config import IMAP_CONFIG, SEND_STRATEGY, DATA_PATHS

PROJECT_ROOT = Path(__file__).resolve().parent.parent


def load_inquiries() -> list[dict]:
    filepath = PROJECT_ROOT / DATA_PATHS["inquiries"]
    if not filepath.exists():
        return []
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)


def save_inquiries(inquiries: list[dict]) -> None:
    filepath = PROJECT_ROOT / DATA_PATHS["inquiries"]
    filepath.parent.mkdir(parents=True, exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(inquiries, f, ensure_ascii=False, indent=2)


def decode_email_header(value) -> str:
    """解码邮件头（处理中文等编码）"""
    if value is None:
        return ""
    decoded_parts = decode_header(value)
    result = []
    for part, charset in decoded_parts:
        if isinstance(part, bytes):
            result.append(part.decode(charset or "utf-8", errors="replace"))
        else:
            result.append(str(part))
    return "".join(result)


def extract_body(msg) -> str:
    """提取邮件正文（优先 HTML → 纯文本）"""
    html_body = None
    text_body = None

    if msg.is_multipart():
        for part in msg.walk():
            content_type = part.get_content_type()
            try:
                payload = part.get_payload(decode=True)
                if payload:
                    decoded = payload.decode("utf-8", errors="replace")
                    if content_type == "text/html":
                        html_body = decoded
                    elif content_type == "text/plain":
                        text_body = decoded
            except Exception:
                continue
    else:
        try:
            text_body = msg.get_payload(decode=True).decode("utf-8", errors="replace")
        except Exception:
            text_body = msg.get_payload()

    # 返回纯文本（去除 HTML 标签的简单处理）
    body = text_body or html_body or ""
    if html_body and not text_body:
        # 简单去 HTML 标签
        import re
        body = re.sub(r"<[^>]+>", " ", html_body)
        body = re.sub(r"\s+", " ", body).strip()

    return body[:5000]  # 限制长度


def find_supplier_by_email(suppliers: list[dict], from_email: str) -> Optional[dict]:
    """根据发件人邮箱匹配供应商"""
    from_lower = from_email.lower()
    for s in suppliers:
        if s.get("email", "").lower() in from_lower or from_lower in s.get("email", "").lower():
            return s
    return None


def check_replies(check_all: bool = False) -> list[dict]:
    """主流程：检查邮箱，提取供应商回复"""
    print(f"\n{'='*50}")
    print("SteelNest 询盘回复检查")
    print(f"{'='*50}")

    # 1. 加载数据
    inquiries = load_inquiries()
    suppliers_file = PROJECT_ROOT / DATA_PATHS["suppliers"]
    if suppliers_file.exists():
        suppliers = json.loads(Path(suppliers_file).read_text("utf-8"))
    else:
        suppliers = []

    # 2. 连接 IMAP
    print(f"[IMAP] 连接 {IMAP_CONFIG['server']}...")
    try:
        mail = imaplib.IMAP4_SSL(IMAP_CONFIG["server"])
        mail.login(IMAP_CONFIG["email"], IMAP_CONFIG["password"])
        mail.select("INBOX")
        print("[IMAP] 登录成功")
    except Exception as e:
        print(f"[ERROR] IMAP 连接失败: {e}")
        return []

    # 3. 搜索回复邮件
    if check_all:
        # 最近30天
        since = (datetime.datetime.now() - datetime.timedelta(days=30)).strftime("%d-%b-%Y")
        status, messages = mail.search(None, f'(SINCE "{since}")')
    else:
        # 仅未读
        status, messages = mail.search(None, "UNSEEN")

    if status != "OK":
        print("[INFO] 没有找到邮件")
        mail.logout()
        return []

    msg_ids = messages[0].split()
    print(f"[INFO] 找到 {len(msg_ids)} 封邮件待检查")

    new_replies = []

    for msg_id in msg_ids[-50:]:  # 最多处理最近50封
        try:
            status, msg_data = mail.fetch(msg_id, "(RFC822)")
            if status != "OK":
                continue

            raw_email = msg_data[0][1]
            msg = email.message_from_bytes(raw_email)

            # 提取发件人
            from_header = decode_email_header(msg["From"])
            # 简单提取邮箱地址
            import re
            from_match = re.search(r"[\w.+-]+@[\w-]+\.[\w.-]+", from_header)
            from_email = from_match.group(0) if from_match else from_header

            # 提取主题和日期
            subject = decode_email_header(msg["Subject"])
            date_str = msg.get("Date", "")

            # 匹配供应商
            matched_supplier = find_supplier_by_email(suppliers, from_email)
            if not matched_supplier:
                continue  # 不是供应商的邮件，跳过

            # 提取正文
            body = extract_body(msg)

            print(f"[REPLY] {matched_supplier['companyName']} — {subject[:50]}")

            # 更新对应的 inquiry 记录
            updated = False
            for inquiry in inquiries:
                if inquiry.get("supplierId") == matched_supplier["id"] and inquiry.get("status") in ["sent", "delivered"]:
                    inquiry["status"] = "replied"
                    inquiry["repliedAt"] = datetime.datetime.now(datetime.timezone.utc).isoformat()
                    inquiry["replyBody"] = body[:3000]
                    inquiry["replySubject"] = subject
                    updated = True
                    break

            if not updated:
                # 没有匹配的 inquiry，创建一个新的
                inquiry_record = {
                    "id": f"inq_reply_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}_{matched_supplier['id']}",
                    "supplierId": matched_supplier["id"],
                    "round": 0,  # 供应商主动回复
                    "subject": f"RE: {subject}",
                    "bodyPreview": body[:200],
                    "sentAt": date_str,
                    "repliedAt": datetime.datetime.now(datetime.timezone.utc).isoformat(),
                    "replyBody": body[:3000],
                    "aiParsed": False,
                    "status": "replied",
                }
                inquiries.append(inquiry_record)

            new_replies.append({
                "supplierId": matched_supplier["id"],
                "companyName": matched_supplier["companyName"],
                "from": from_email,
                "subject": subject,
                "body": body[:500],
                "date": date_str,
            })

        except Exception as e:
            print(f"  [ERROR] 处理邮件失败: {e}")

    mail.logout()

    # 保存
    if new_replies:
        save_inquiries(inquiries)
        print(f"\n[OK] 找到 {len(new_replies)} 封供应商回复，已保存到 inquiries.json")
    else:
        print("\n[INFO] 没有找到新的供应商回复")

    return new_replies


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="SteelNest 询盘回复检查工具")
    parser.add_argument("--all", action="store_true", help="检查最近30天所有邮件（不仅是未读）")
    args = parser.parse_args()

    check_replies(check_all=args.all)
