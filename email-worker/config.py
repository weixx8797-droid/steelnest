"""
============================================================
SteelNest 自动询盘邮件系统 — 配置文件
============================================================
修改这个文件即可自定义邮件模板、发送策略、邮箱设置
小白友好：所有配置都有中文注释，改完保存即可
============================================================
"""

# ============================================================
# 📧 邮箱账户配置
# ============================================================

# ---- 发件邮箱（SMTP）----
# Gmail 用户：SMTP_SERVER = "smtp.gmail.com"，SMTP_PORT = 587
# QQ邮箱用户：SMTP_SERVER = "smtp.qq.com"，SMTP_PORT = 587
# 163邮箱用户：SMTP_SERVER = "smtp.163.com"，SMTP_PORT = 465（SSL）
# 腾讯企业邮：SMTP_SERVER = "smtp.exmail.qq.com"，SMTP_PORT = 587
# 阿里企业邮：SMTP_SERVER = "smtp.qiye.aliyun.com"，SMTP_PORT = 465（SSL）

SMTP_CONFIG = {
    "server": "smtp.gmail.com",       # SMTP 服务器地址
    "port": 587,                      # 端口 587=TLS, 465=SSL
    "use_ssl": False,                 # 端口 465 时改为 True
    "email": "your-email@gmail.com",  # 发件邮箱地址
    "password": "",                   # 邮箱授权码（不是登录密码！见 README）
    "sender_name": "SteelNest Sourcing Team",  # 发件人显示名
}

# ---- 收件邮箱（IMAP，用于检查回复）----
# Gmail：IMAP_SERVER = "imap.gmail.com"
# QQ邮箱：IMAP_SERVER = "imap.qq.com"
# 163邮箱：IMAP_SERVER = "imap.163.com"

IMAP_CONFIG = {
    "server": "imap.gmail.com",
    "email": "your-email@gmail.com",  # 通常和发件邮箱相同
    "password": "",                   # 邮箱授权码
}

# ============================================================
# ⏱️ 发送策略配置
# ============================================================

SEND_STRATEGY = {
    # 每封邮件之间的随机延迟（秒）
    "delay_between_emails_min": 30,   # 最少 30 秒
    "delay_between_emails_max": 120,  # 最多 120 秒（模拟人工发送）

    # 每日发送上限（Gmail 免费版 500/天；Resend 免费 100/天）
    "max_emails_per_day": 50,

    # 失败重试
    "max_retries": 3,                 # 单封邮件最多重试次数
    "retry_delay_minutes": 15,        # 重试间隔

    # 多轮跟进时间（天数）
    "round_2_delay_days": 3,          # 第1轮后3天无回复 → 第2轮
    "round_3_delay_days": 7,          # 第2轮后7天仍无回复 → 第3轮

    # 最大并发连接数（IMAP）
    "imap_batch_size": 10,
}

# ============================================================
# 📝 邮件模板配置
# ============================================================

# 第1轮邮件 — 初始询盘
INQUIRY_ROUND_1 = {
    "subject": "Inquiry: {product_category} — SteelNest (US-Based Brand)",
    "body_html": """<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #2D3436;">
    <p>Dear {contact_name},</p>

    <p>My name is {sender_name} from <strong>SteelNest</strong>, a US-based home organization brand. We came across your company on Alibaba and are interested in your <strong>{product_category}</strong> products.</p>

    <p>We are looking for a reliable long-term supplier and would appreciate it if you could provide the following:</p>

    <ul>
        <li>Product catalog and wholesale pricing (FOB preferred)</li>
        <li>MOQ (minimum order quantity)</li>
        <li>Sample availability and sample cost</li>
        <li>Estimated lead time for production</li>
        <li>Shipping options to the United States</li>
    </ul>

    <p>Our initial order volume is typically 50-200 units per SKU, with the potential to scale based on product performance.</p>

    <p>Looking forward to hearing from you.</p>

    <p>
        Best regards,<br>
        <strong>{sender_name}</strong><br>
        SteelNest Sourcing Team<br>
        📧 {sender_email}
    </p>
</body>
</html>""",
}

# 第2轮邮件 — 温和跟进（3天后无回复）
INQUIRY_ROUND_2 = {
    "subject": "Re: Inquiry: {product_category} — SteelNest",
    "body_html": """<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #2D3436;">
    <p>Dear {contact_name},</p>

    <p>I hope this message finds you well. I wanted to follow up on my inquiry from a few days ago regarding your <strong>{product_category}</strong> products.</p>

    <p>We at SteelNest are actively evaluating suppliers and would love to include your products in our comparison if you're interested in partnering with us.</p>

    <p>I've re-attached the key points we'd like to discuss:</p>

    <ul>
        <li>Product catalog and FOB pricing</li>
        <li>MOQ requirements</li>
        <li>Sample availability</li>
        <li>Production lead times</li>
    </ul>

    <p>If now isn't a good time, a quick note would be appreciated — we'll adjust our timeline accordingly.</p>

    <p>
        Best regards,<br>
        <strong>{sender_name}</strong><br>
        SteelNest Sourcing Team
    </p>
</body>
</html>""",
}

# 第3轮邮件 — 最后提醒（7天后仍无回复）
INQUIRY_ROUND_3 = {
    "subject": "Final Follow-up: {product_category} Inquiry — SteelNest",
    "body_html": """<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #2D3436;">
    <p>Dear {contact_name},</p>

    <p>This is a brief final note regarding our inquiry about your <strong>{product_category}</strong> products.</p>

    <p>We're finalizing our supplier shortlist this week. If you're interested in working with SteelNest, we'd love to hear from you before then. If the timing doesn't work out, no worries at all — we'll keep your contact for future opportunities.</p>

    <p>Wishing you and your team all the best.</p>

    <p>
        Best regards,<br>
        <strong>{sender_name}</strong><br>
        SteelNest Sourcing Team
    </p>
</body>
</html>""",
}

# ============================================================
# 🤖 AI 解析配置（DeepSeek — 兼容 OpenAI SDK）
# ============================================================

AI_PARSER_CONFIG = {
    # DeepSeek API Key（从环境变量 DEEPSEEK_API_KEY 读取）
    # 默认模型 deepseek-v4-pro（可在 .env.local 中改 DEEPSEEK_MODEL）
    # 不配也能用，系统自动降级为手动模式
    "temperature": 0.1,              # 低温度 = 输出更稳定

    # AI 解析的提词模板
    "prompt_template": """
You are a procurement assistant for SteelNest, a US home organization brand.

Parse the following supplier email reply and extract the key information in JSON format.
If a field is not mentioned in the email, set it to null.

Supplier reply:
---
{email_body}
---

Return ONLY valid JSON (no markdown, no explanation):
{{
    "supplier_company": "Company name if mentioned, else null",
    "products_mentioned": [
        {{
            "name": "Product name or description",
            "unit_price_usd": "Unit price in USD (convert from CNY if needed, assume 1 USD = 7.25 CNY if no rate given)",
            "moq": "Minimum order quantity",
            "sample_cost": "Sample price if mentioned, else null",
            "sample_available": true or false,
            "lead_time": "Production time, e.g. '15-20 days'",
            "shipping_cost_estimate": "Shipping cost if mentioned",
            "material": "Material if specified",
            "specifications": "Size, weight, color etc."
        }}
    ],
    "payment_terms": "Payment terms if mentioned, e.g. '30% deposit, 70% before shipment'",
    "supplier_notes": "Any other important information",
    "confidence": "high/medium/low based on how clear the pricing info is"
}}
"""
}

# ============================================================
# 📂 数据文件路径
# ============================================================

DATA_PATHS = {
    "suppliers": "../src/data/suppliers.json",
    "inquiries": "../src/data/inquiries.json",
    "quotes": "../src/data/quotes.json",
}
