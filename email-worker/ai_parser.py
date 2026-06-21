"""
============================================================
SteelNest 自动询盘邮件系统 — AI 解析报价模块
============================================================
读取 inquiries.json 中已回复但未解析的邮件 → 调用 OpenAI API 提取报价 → 存到 quotes.json

用法：
    python ai_parser.py                    # 解析所有未处理的回复
    python ai_parser.py --id inq_xxx       # 解析指定 inquiry
============================================================
"""

import json
import os
import sys
import argparse
import datetime
from pathlib import Path
from typing import Optional

# 尝试加载 .env 文件（如果 python-dotenv 已安装）
try:
    from dotenv import load_dotenv
    # 优先读 email-worker/.env，其次读项目根目录 .env.local
    env_path = Path(__file__).resolve().parent / ".env"
    if env_path.exists():
        load_dotenv(env_path)
    else:
        root_env = Path(__file__).resolve().parent.parent / ".env.local"
        if root_env.exists():
            load_dotenv(root_env)
except ImportError:
    pass  # python-dotenv 未安装，直接用系统环境变量

from config import AI_PARSER_CONFIG, DATA_PATHS

PROJECT_ROOT = Path(__file__).resolve().parent.parent

# DeepSeek API Key — 从环境变量读取（兼容 OpenAI SDK）
DEEPSEEK_API_KEY = os.environ.get("DEEPSEEK_API_KEY", "") or os.environ.get("OPENAI_API_KEY", "")
DEEPSEEK_MODEL = os.environ.get("DEEPSEEK_MODEL", "deepseek-v4-flash")


def load_inquiries() -> list[dict]:
    filepath = PROJECT_ROOT / DATA_PATHS["inquiries"]
    if not filepath.exists():
        return []
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)


def save_inquiries(inquiries: list[dict]) -> None:
    filepath = PROJECT_ROOT / DATA_PATHS["inquiries"]
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(inquiries, f, ensure_ascii=False, indent=2)


def load_quotes() -> list[dict]:
    filepath = PROJECT_ROOT / DATA_PATHS["quotes"]
    if not filepath.exists():
        return []
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)


def save_quotes(quotes: list[dict]) -> None:
    filepath = PROJECT_ROOT / DATA_PATHS["quotes"]
    filepath.parent.mkdir(parents=True, exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(quotes, f, ensure_ascii=False, indent=2)


def parse_with_deepseek(reply_body: str) -> Optional[dict]:
    """调用 DeepSeek API 解析报价（兼容 OpenAI SDK）"""
    if not DEEPSEEK_API_KEY:
        print("[SKIP] 未设置 DEEPSEEK_API_KEY，跳过 AI 解析")
        return None

    try:
        from openai import OpenAI

        # DeepSeek 使用 OpenAI 兼容接口，只需改 base_url
        client = OpenAI(
            api_key=DEEPSEEK_API_KEY,
            base_url="https://api.deepseek.com",
        )

        prompt = AI_PARSER_CONFIG["prompt_template"].format(email_body=reply_body[:4000])

        response = client.chat.completions.create(
            model=DEEPSEEK_MODEL,
            temperature=AI_PARSER_CONFIG["temperature"],
            messages=[
                {"role": "system", "content": "You are a procurement data extraction assistant. Always output valid JSON only."},
                {"role": "user", "content": prompt},
            ],
            max_tokens=2000,
        )

        content = response.choices[0].message.content or ""
        # 提取 JSON
        json_str = content.strip()
        if json_str.startswith("```"):
            lines = json_str.split("\n")
            json_str = "\n".join(lines[1:-1] if lines[-1].strip() == "```" else lines[1:])

        return json.loads(json_str)

    except Exception as e:
        print(f"[ERROR] DeepSeek 解析失败: {e}")
        return None


def parse_without_ai(reply_body: str) -> dict:
    """无 AI 时的降级解析（仅记录原文）"""
    return {
        "supplier_company": None,
        "products_mentioned": [],
        "payment_terms": None,
        "supplier_notes": "AI 解析未启用。请查看 rawReply 手动提取报价。",
        "confidence": "none",
    }


def parse_replies(inquiry_id: Optional[str] = None) -> list[dict]:
    """主流程：解析供应商回复"""
    print(f"\n{'='*50}")
    print("SteelNest AI 报价解析")
    print(f"{'='*50}")

    inquiries = load_inquiries()
    quotes = load_quotes()

    # 筛选需要解析的回复
    to_parse = [
        i for i in inquiries
        if i.get("status") == "replied"
        and not i.get("aiParsed")
        and i.get("replyBody")
    ]

    if inquiry_id:
        to_parse = [i for i in to_parse if i["id"] == inquiry_id]

    if not to_parse:
        print("[INFO] 没有待解析的回复")
        return []

    print(f"[INFO] 找到 {len(to_parse)} 封回复待解析")

    new_quotes = []

    for inquiry in to_parse:
        print(f"[PARSE] {inquiry['id']} — {inquiry.get('supplierId', 'unknown')}")

        reply_body = inquiry.get("replyBody", "")

        # 尝试 DeepSeek AI 解析
        parsed = parse_with_deepseek(reply_body) if DEEPSEEK_API_KEY else parse_without_ai(reply_body)

        # 生成报价记录
        quote = {
            "id": f"qt_{datetime.datetime.now().strftime('%Y%m%d')}_{inquiry['supplierId']}",
            "inquiryId": inquiry["id"],
            "supplierId": inquiry["supplierId"],
            "products": [],
            "rawReply": reply_body,
            "parsedByAI": bool(DEEPSEEK_API_KEY and parsed),
            "aiModel": DEEPSEEK_MODEL if DEEPSEEK_API_KEY else None,
            "adminReviewed": False,
            "createdAt": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        }

        # 转换 AI 解析结果为标准产品格式
        if parsed and parsed.get("products_mentioned"):
            for idx, prod in enumerate(parsed["products_mentioned"]):
                price_str = str(prod.get("unit_price_usd", "")).replace("$", "").replace(",", "")
                try:
                    unit_price = float(price_str)
                except (ValueError, TypeError):
                    unit_price = 0

                moq_str = str(prod.get("moq", "0")).replace(",", "").split()[0]
                try:
                    moq = int(moq_str)
                except (ValueError, TypeError):
                    moq = 0

                quote["products"].append({
                    "id": f"qtp_{inquiry['supplierId']}_{idx+1}",
                    "supplierProductName": prod.get("name", "Unknown Product"),
                    "supplierSku": None,
                    "unitPriceUSD": unit_price,
                    "moq": moq,
                    "samplePrice": prod.get("sample_cost"),
                    "shippingTime": prod.get("lead_time", ""),
                    "material": prod.get("material"),
                    "dimensions_cm": prod.get("specifications"),
                    "addedToQueue": False,
                })

        if parsed:
            quote["paymentTerms"] = parsed.get("payment_terms")
            quote["notes"] = parsed.get("supplier_notes")
            quote["confidence"] = parsed.get("confidence", "unknown")

        quotes.append(quote)
        new_quotes.append(quote)

        # 标记已解析
        inquiry["aiParsed"] = True

    # 保存
    if new_quotes:
        save_quotes(quotes)
        save_inquiries(inquiries)
        print(f"\n[OK] 解析完成，{len(new_quotes)} 条报价已保存到 quotes.json")
    else:
        print("\n[INFO] 没有新报价生成")

    return new_quotes


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="SteelNest AI 报价解析工具")
    parser.add_argument("--id", type=str, help="解析指定的 inquiry ID")
    args = parser.parse_args()

    # 检查 DeepSeek Key
    if not DEEPSEEK_API_KEY:
        print("[WARN] 未检测到 DEEPSEEK_API_KEY 环境变量")
        print("[INFO] 将使用降级模式：仅保存原始回复，不进行 AI 解析")
        print("[INFO] 设置方法：在 .env.local 中设置 DEEPSEEK_API_KEY=sk-xxx")
        print()

    parse_replies(inquiry_id=args.id)
