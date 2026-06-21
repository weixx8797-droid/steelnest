"""
============================================================
SteelNest 自动询盘邮件系统 — 批量发送模块
============================================================
读取 suppliers.json → 逐封发送询盘邮件 → 记录到 inquiries.json

用法：
    python send_inquiries.py           # 发送第1轮询盘
    python send_inquiries.py --round 2  # 发送第2轮跟进
    python send_inquiries.py --dry-run   # 预览模式（不实际发送）
============================================================
"""

import json
import time
import random
import smtplib
import argparse
import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from pathlib import Path
from typing import Optional

# 导入配置
from config import (
    SMTP_CONFIG, SEND_STRATEGY, DATA_PATHS,
    INQUIRY_ROUND_1, INQUIRY_ROUND_2, INQUIRY_ROUND_3
)

# ---- 获取项目根目录 ----
PROJECT_ROOT = Path(__file__).resolve().parent.parent


def load_suppliers() -> list[dict]:
    """加载供应商列表"""
    filepath = PROJECT_ROOT / DATA_PATHS["suppliers"]
    if not filepath.exists():
        print(f"[ERROR] 供应商文件不存在: {filepath}")
        return []
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)


def load_inquiries() -> list[dict]:
    """加载已有的询盘记录"""
    filepath = PROJECT_ROOT / DATA_PATHS["inquiries"]
    if not filepath.exists():
        return []
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)


def save_inquiries(inquiries: list[dict]) -> None:
    """保存询盘记录"""
    filepath = PROJECT_ROOT / DATA_PATHS["inquiries"]
    filepath.parent.mkdir(parents=True, exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(inquiries, f, ensure_ascii=False, indent=2)
    print(f"[OK] 询盘记录已保存: {filepath}")


def get_template(round_num: int) -> dict:
    """获取对应轮次的邮件模板"""
    templates = {1: INQUIRY_ROUND_1, 2: INQUIRY_ROUND_2, 3: INQUIRY_ROUND_3}
    return templates.get(round_num, INQUIRY_ROUND_1)


def build_email(supplier: dict, round_num: int) -> tuple[str, str]:
    """构建邮件（返回主题和 HTML 正文）"""
    template = get_template(round_num)
    sender_name = SMTP_CONFIG["sender_name"]
    sender_email = SMTP_CONFIG["email"]

    # 占位符替换
    product_cat = ", ".join(supplier.get("productCategories", ["home organization"]))
    placeholders = {
        "{contact_name}": supplier.get("contactName", "Supplier"),
        "{sender_name}": sender_name,
        "{sender_email}": sender_email,
        "{product_category}": product_cat,
    }

    subject = template["subject"]
    body = template["body_html"]
    for key, val in placeholders.items():
        subject = subject.replace(key, val)
        body = body.replace(key, val)

    return subject, body


def send_single_email(
    supplier: dict,
    subject: str,
    body_html: str,
    dry_run: bool = False
) -> dict:
    """发送单封邮件，返回结果"""
    result = {
        "supplierId": supplier["id"],
        "supplierEmail": supplier["email"],
        "subject": subject,
        "status": "pending",
        "error": None,
        "sentAt": datetime.datetime.now(datetime.timezone.utc).isoformat(),
    }

    if dry_run:
        result["status"] = "dry_run"
        return result

    # 构建邮件
    msg = MIMEMultipart("alternative")
    msg["From"] = f"{SMTP_CONFIG['sender_name']} <{SMTP_CONFIG['email']}>"
    msg["To"] = supplier["email"]
    msg["Subject"] = subject
    msg.attach(MIMEText(body_html, "html"))

    # 发送（带重试）
    for attempt in range(SEND_STRATEGY["max_retries"]):
        try:
            if SMTP_CONFIG["use_ssl"]:
                server = smtplib.SMTP_SSL(SMTP_CONFIG["server"], SMTP_CONFIG["port"])
            else:
                server = smtplib.SMTP(SMTP_CONFIG["server"], SMTP_CONFIG["port"])
                server.starttls()

            server.login(SMTP_CONFIG["email"], SMTP_CONFIG["password"])
            server.sendmail(SMTP_CONFIG["email"], supplier["email"], msg.as_string())
            server.quit()
            result["status"] = "sent"
            return result
        except Exception as e:
            if attempt < SEND_STRATEGY["max_retries"] - 1:
                print(f"  [RETRY {attempt+1}] {supplier['email']}: {e}")
                time.sleep(SEND_STRATEGY["retry_delay_minutes"] * 60)
            else:
                result["status"] = "failed"
                result["error"] = str(e)

    return result


def send_inquiries(round_num: int = 1, dry_run: bool = False) -> None:
    """主发送流程"""
    suppliers = load_suppliers()
    active_suppliers = [s for s in suppliers if s.get("status") == "active"]

    if not active_suppliers:
        print("[INFO] 没有活跃的供应商，请在管理后台添加供应商")
        return

    print(f"\n{'[DRY RUN] ' if dry_run else ''}准备向 {len(active_suppliers)} 家供应商发送第{round_num}轮询盘")
    print("-" * 50)

    inquiries = load_inquiries()
    results = []
    sent_count = 0

    for supplier in active_suppliers:
        # 检查今日已发送量
        if not dry_run and sent_count >= SEND_STRATEGY["max_emails_per_day"]:
            print(f"[STOP] 已达到每日上限 {SEND_STRATEGY['max_emails_per_day']} 封")
            break

        # 检查是否已经给这个供应商发过同一轮
        already_sent = any(
            i.get("supplierId") == supplier["id"] and i.get("round") == round_num
            for i in inquiries
        )
        if already_sent:
            print(f"[SKIP] {supplier['companyName']} — 第{round_num}轮已发送过")
            continue

        # 构建和发送
        subject, body = build_email(supplier, round_num)
        print(f"[SEND] {supplier['email']} ({supplier['companyName']}) — {subject[:50]}...")

        result = send_single_email(supplier, subject, body, dry_run)

        # 记录到 inquiries
        inquiry_record = {
            "id": f"inq_{datetime.datetime.now().strftime('%Y%m%d')}_{supplier['id']}",
            "supplierId": supplier["id"],
            "round": round_num,
            "templateUsed": f"round_{round_num}",
            "subject": result["subject"],
            "bodyPreview": body[:200],
            "sentAt": result["sentAt"],
            "repliedAt": None,
            "replyBody": None,
            "aiParsed": False,
            "status": result["status"] if result["status"] != "failed" else "sent",
        }
        inquiries.append(inquiry_record)

        if result["status"] == "sent":
            sent_count += 1
            print(f"  [OK] 发送成功")
        elif result["status"] == "failed":
            print(f"  [FAIL] {result['error'][:100]}")

        results.append(result)

        # 随机延迟（防垃圾邮件检测）
        if not dry_run and sent_count < len(active_suppliers):
            delay = random.randint(
                SEND_STRATEGY["delay_between_emails_min"],
                SEND_STRATEGY["delay_between_emails_max"]
            )
            print(f"  [WAIT] {delay} 秒后发下一封...")
            time.sleep(delay)

    # 保存记录
    if not dry_run:
        save_inquiries(inquiries)

    # 汇总
    print("\n" + "=" * 50)
    print(f"发送完成：成功 {sent_count} | 失败 {len([r for r in results if r['status'] == 'failed'])} | 总计 {len(results)}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="SteelNest 询盘邮件发送工具")
    parser.add_argument("--round", type=int, default=1, help="发送轮次 (1/2/3)")
    parser.add_argument("--dry-run", action="store_true", help="预览模式，不实际发送")
    args = parser.parse_args()

    send_inquiries(round_num=args.round, dry_run=args.dry_run)
