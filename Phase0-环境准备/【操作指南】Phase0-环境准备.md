# 🛠️ Phase 0：环境准备 — 操作指南

> 🎯 **目标**：在你的电脑上装好所有开发工具，注册所有需要的账号
> ⏱️ **预计耗时**：2-3 小时（你可以分几次完成）
> 💰 **费用**：全部免费

---

## 📋 总览清单

| 序号 | 项目 | 类型 | 难度 |
|------|------|------|------|
| 1 | 安装 Node.js | 软件 | ⭐ 一路下一步 |
| 2 | 安装 VS Code | 软件 | ⭐ 一路下一步 |
| 3 | 安装 Git | 软件 | ⭐ 一路下一步 |
| 4 | 注册 GitHub | 账号 | ⭐ 填邮箱密码 |
| 5 | 注册 Vercel | 账号 | ⭐ 用 GitHub 一键登录 |
| 6 | 注册 Stripe | 账号 | ⭐⭐ 需填企业信息 |
| 7 | 注册 Resend | 账号 | ⭐ 填邮箱注册 |
| 8 | 注册 Cloudflare | 账号 | ⭐ 填邮箱注册 |

---

## 1️⃣ 安装 Node.js

> **这是什么？** Node.js 是让电脑能运行 JavaScript 代码的环境。你不需要理解它，装上就行。

### Windows 版本

1. 打开浏览器，访问：**https://nodejs.org**
2. 你会看到两个绿色大按钮，点击 **左边的「LTS」版本**（长期稳定版）
   - 按钮上写着类似 `20.x.x LTS` 的字样
3. 下载完成后，双击 `.msi` 文件
4. 安装窗口弹出后，一路点击 **「Next >」**
   - 所有选项保持默认，不要改任何东西
5. 最后点击 **「Install」**，等待进度条跑完
6. 安装完成后点击 **「Finish」**

### Mac 版本

1. 打开浏览器，访问：**https://nodejs.org**
2. 点击左边的 **「LTS」版本**（长期稳定版）
3. 下载完成后，双击 `.pkg` 文件
4. 安装窗口弹出后，一路点击 **「继续」→「安装」**
5. 输入你的 Mac 开机密码确认
6. 安装完成后点击 **「关闭」**

### ✅ 验证安装成功

1. 按键盘 `Win键 + R`（Windows）或 `Command + 空格`（Mac）
2. 输入 `cmd`（Windows）或 `Terminal`（Mac）并回车
3. 在黑色窗口中输入：
   ```
   node --version
   ```
4. 如果看到类似 `v20.x.x` 的数字，说明安装成功！

---

## 2️⃣ 安装 VS Code

> **这是什么？** VS Code 是写代码的编辑器（像 Word 写文档，VS Code 写代码）。免费，微软出品。

### Windows 版本

1. 访问：**https://code.visualstudio.com**
2. 点击蓝色大按钮 **「Download for Windows」**
3. 下载完成后，双击 `VSCodeSetup-x64-xxx.exe`
4. ⚠️ **这一步要注意**：安装过程中，勾选以下选项：
   - ✅ 「添加到 PATH」
   - ✅ 「将 "通过 Code 打开" 添加到文件夹右键菜单」
5. 其他保持默认，一路 **「下一步」→「安装」→「完成」**

### Mac 版本

1. 访问：**https://code.visualstudio.com**
2. 点击 **「Download for Mac」**
3. 下载完成后，双击 `.zip` 解压
4. 把解压出来的 **「Visual Studio Code」** 图标拖到 **「应用程序」** 文件夹
5. 完成！

### ✅ 验证安装成功

双击 VS Code 图标，能看到编辑器界面就是成功了。

---

## 3️⃣ 安装 Git

> **这是什么？** Git 是版本管理工具，用来把你的代码同步到 GitHub。你主要用 VS Code 界面操作，很少直接碰它。

### Windows 版本

1. 访问：**https://git-scm.com/download/win**
2. 下载会自动开始，如未开始点击 **「Click here to download manually」**
3. 下载完成后，双击 `.exe` 文件
4. ⚠️ 安装过程中选项很多，**除了下面这步，其他全部保持默认一路 Next**：
   - 当看到「Choosing the default editor」页面时：
     - 下拉框选择 **「Use Visual Studio Code as Git's default editor」**
5. 其他全部 **「Next >」→「Install」→「Finish」**

### Mac 版本

Mac 通常已自带 Git。如果没有：

1. 打开「终端」（Terminal）
2. 输入 `git --version`
3. 如果弹出安装提示，点击 **「安装」** 即可
4. 如果没有提示且没有显示版本号，访问：**https://git-scm.com/download/mac** 下载安装

### ✅ 验证安装成功

1. 打开命令行（Win键+R 输入 `cmd` / Mac 打开 Terminal）
2. 输入 `git --version`
3. 看到 `git version 2.x.x` 即成功

---

## 4️⃣ 注册 GitHub 账号

> **这是什么？** GitHub 是全球最大的代码托管平台，你的网站代码会存在这里。免费。

1. 访问：**https://github.com/signup**
2. 输入你的邮箱地址，点击「Continue」
3. 设置密码（至少 8 位，含数字和字母）
4. 设置用户名（建议用品牌名或你的名字，全小写英文）
5. 完成人机验证（拼图或选图）
6. 点击「Create account」
7. 收到验证码邮件后，输入验证码
8. 注册完成！

> 📝 **记下来**：用户名：__________ | 邮箱：__________

---

## 5️⃣ 注册 Vercel 账号

> **这是什么？** Vercel 是免费部署平台，你的网站将通过它发布到互联网。零配置，自动部署。

1. 访问：**https://vercel.com/signup**
2. ⚠️ **重要**：选择 **「Continue with GitHub」**（用 GitHub 账号登录）
3. 授权 Vercel 访问你的 GitHub
4. 选择「Personal Account」（个人账户）
5. 完成注册！

---

## 6️⃣ 注册 Stripe 账号

> **这是什么？** Stripe 是支付平台，用来收顾客的信用卡付款。不收费注册，只在产生交易时扣手续费。

1. 访问：**https://dashboard.stripe.com/register**
2. 填写：
   - 邮箱地址
   - 姓名（用拼音，比如 ZHANG SAN）
   - 密码
   - 国家选择你所在的国家
3. 点击「Create account」
4. ⚠️ **先激活测试模式**（不需要现在提交企业资料）：
   - 注册后默认就是 **「Test Mode」（测试模式）**
   - 顶栏看到 `Test mode` 字样就对了
   - 我们开发阶段只用测试模式，上线前再激活正式账号
5. 暂时不用填任何企业信息，后续我会一步一步指导

> 📝 **重要**：注册完成后先不要关闭页面，等我说的时候再去获取 API 密钥。

---

## 7️⃣ 注册 Resend 账号

> **这是什么？** Resend 是邮件发送服务，用来发订单确认邮件给顾客。免费额度 100 封/天。

1. 访问：**https://resend.com/signup**
2. 输入邮箱和密码
3. 或者直接用 GitHub 账号登录
4. 注册完成！

> 💡 后续我会帮你在 Resend 配置发件域名。

---

## 8️⃣ 注册 Cloudflare 账号

> **这是什么？** Cloudflare 提供免费的 DNS 解析和 CDN 加速，你的域名将在这里管理。

1. 访问：**https://dash.cloudflare.com/sign-up**
2. 输入邮箱和密码
3. 点击「Create Account」
4. 注册完成！

> 💡 等我们正式上线前才需要用到，现在先注册好。

---

## 🏁 Phase 0 完成标志

当你完成以上 8 个步骤后，请告诉我，我会验证环境是否就绪，然后进入 Phase 1。

---

## 🆘 遇到问题？

如果在安装过程中遇到任何报错或异常：
1. 截图保存
2. 把错误信息复制给我
3. 我会帮你排查

**不要慌，任何问题都能解决！**

---

*🤖 Claude Code 全程护航 | 有问题随时问*
