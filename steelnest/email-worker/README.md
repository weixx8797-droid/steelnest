# 📧 SteelNest 自动询盘邮件系统 — 小白操作指南

> 本文档用最简单的语言教你配置和使用自动询盘邮件系统  
> 不需要任何编程基础，跟着步骤做就行

---

## 一、这个系统能做什么？

```
你告诉它供应商邮箱 → 自动发询盘邮件 → 自动检查回复 → AI 提取报价 → 结果存到后台
```

**支持功能：**
- ✅ 批量给供应商发询盘邮件（英文）
- ✅ 3 轮自动跟进（3 天 → 7 天 → 最终提醒）
- ✅ 自动检测供应商回复
- ✅ AI 自动解析报价（单价/MOQ/交期等）
- ✅ 反垃圾邮件策略（随机延迟、日限流、自动重试）

---

## 二、准备工作（5 分钟）

### 2.1 获取邮箱授权码（必做）

> ⚠️ **不是你的邮箱登录密码！** 是专门给程序用的"应用专用密码"

**Gmail 用户：**
1. 打开 https://myaccount.google.com/security
2. 搜索"应用专用密码"（App Passwords）
3. 如果找不到 → 先开启"两步验证"（2-Step Verification）
4. 选择"Mail" → "Windows Computer" → 生成
5. 复制 16 位密码（格式如：`abcd efgh ijkl mnop`）

**QQ 邮箱用户：**
1. 登录 QQ 邮箱 → 设置 → 账户
2. 找到 POP3/IMAP/SMTP 服务 → 开启
3. 点击"生成授权码" → 复制 16 位授权码

**163 邮箱用户：**
1. 登录 163 邮箱 → 设置 → POP3/SMTP/IMAP
2. 开启 IMAP/SMTP 服务
3. 设置"客户端授权密码" → 复制

### 2.2 （可选）获取 OpenAI API Key

如果你想用 AI 自动解析供应商报价，需要这个。不配置也能用——只是报价需要手动看。

1. 打开 https://platform.openai.com/api-keys
2. 注册账号（新用户通常有 $5 免费额度）
3. 点击 "Create new secret key" → 复制 `sk-xxx...` 开头的密钥

---

## 三、配置（3 分钟）

打开 `email-worker/config.py` 文件，只需改 3 个地方：

### 1. 邮箱设置（必改）

```python
SMTP_CONFIG = {
    "server": "smtp.gmail.com",        # Gmail 不改；QQ 改成 smtp.qq.com；163 改成 smtp.163.com
    "port": 587,                        # QQ邮箱也填 587；163 填 465
    "use_ssl": False,                   # 163 改成 True
    "email": "你的邮箱@gmail.com",       # ← 改成你的
    "password": "你的16位授权码",         # ← 改成你的授权码
    "sender_name": "SteelNest Sourcing Team",  # 发件人显示名
}

IMAP_CONFIG = {
    "server": "imap.gmail.com",         # QQ 改成 imap.qq.com；163 改成 imap.163.com
    "email": "你的邮箱@gmail.com",       # ← 改成你的
    "password": "你的16位授权码",         # ← 改成你的授权码
}
```

### 2. 发送策略（一般不用改）

```python
SEND_STRATEGY = {
    "delay_between_emails_min": 30,    # 每封邮件最少间隔 30 秒
    "delay_between_emails_max": 120,   # 最多 120 秒
    "max_emails_per_day": 50,          # 每天最多发 50 封
    "round_2_delay_days": 3,           # 第 2 轮等待 3 天
    "round_3_delay_days": 7,           # 第 3 轮等待 7 天
}
```

### 3. 设置 OpenAI API Key（可选）

**方法一（推荐）：设置系统环境变量**

- Windows：在开始菜单搜索"环境变量"→ 新建 → 变量名 `OPENAI_API_KEY` → 值 `sk-xxx`
- Mac：打开终端输入 `export OPENAI_API_KEY=sk-xxx`

**方法二：在命令行运行时临时设置**

```bash
# Windows PowerShell
$env:OPENAI_API_KEY="sk-xxx"

# Mac Terminal
export OPENAI_API_KEY="sk-xxx"
```

---

## 四、安装依赖（1 分钟）

打开终端（Win+R → 输入 `cmd`），复制粘贴以下命令：

```bash
cd "C:\Users\86181\Desktop\独立站项目\steelnest\email-worker"
pip install -r requirements.txt
```

看到 `Successfully installed` 就是成功了。

---

## 五、使用方法

### 5.1 添加供应商

打开管理后台 → 供应商管理 → 添加供应商邮箱和信息  
或者直接编辑 `src/data/suppliers.json`

### 5.2 预览发送（先看看会发给谁，不真发）

```bash
python main.py --action send --dry-run
```

### 5.3 正式发送第 1 轮询盘

```bash
python main.py --action send
```

### 5.4 检查供应商回复

```bash
python main.py --action check
```

### 5.5 AI 解析报价

```bash
python main.py --action parse
```

### 5.6 一键执行完整流程

```bash
python main.py --action all
```

### 5.7 发送第 2 轮跟进

```bash
python main.py --action send --round 2
```

### 5.8 发送第 3 轮跟进

```bash
python main.py --action send --round 3
```

---

## 六、常见问题

### Q: 报错 "SMTPAuthenticationError" 怎么办？

A: 密码不对。确认用的是**授权码**（不是邮箱登录密码）。

### Q: 发出去的邮件进垃圾箱怎么办？

A: 
- 不要短时间内发太多（已内置随机延迟）
- 邮件内容不要全是链接和图片（已用纯文本+简单HTML）
- 加收件人到通讯录有助于提升送达率

### Q: 供应商收到了但没回复？

A: 很正常。系统会自动在第 3 天和第 7 天跟进。如果三轮都没回 → 可能不感兴趣或邮箱不常用。

### Q: AI 解析不准怎么办？

A: 去管理后台 → 询盘管理 → 找到那条报价 → 手动编辑修正。

### Q: 不想用 AI 解析？

A: 不设置 `OPENAI_API_KEY` 环境变量就行。系统会自动跳过 AI，仅保存原始回复。

### Q: Gmail 每天能发多少封？

A: 免费版 Gmail 每天 500 封上限。系统默认限制 50 封/天（安全值）。可在 config.py 修改。

### Q: 可以定时自动执行吗？

A: 可以。配合 GitHub Actions 或 Windows 任务计划程序，设置每天/每周自动运行。

---

## 七、文件说明

```
email-worker/
├── config.py            ← 所有配置在这里（改了就能用）
├── main.py              ← 主入口（运行这个）
├── send_inquiries.py    ← 发送邮件
├── check_replies.py     ← 检查回复
├── ai_parser.py         ← AI 解析报价
├── templates/           ← 邮件 HTML 模板
│   ├── round_1.html     ← 第1轮询盘
│   ├── round_2.html     ← 第2轮跟进
│   └── round_3.html     ← 第3轮提醒
├── requirements.txt     ← Python 依赖
└── README.md            ← 本文件
```

---

> 🤖 全程由 Claude Code 编写 | 有问题随时问
