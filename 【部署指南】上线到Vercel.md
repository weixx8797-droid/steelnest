# 🚀 SteelNest 部署上线指南

> ⏱️ **预计耗时**：1-2 小时
> 💰 **费用**：免费（除域名费 ¥50-100/年）

---

## 第一步：把代码推送到 GitHub

### Windows 版本

#### 1.1 在 GitHub 创建仓库
1. 打开浏览器，登录 https://github.com
2. 点击右上角 **「+」→「New repository」**
3. Repository name 填：**steelnest**（全小写，没有空格）
4. Description 填：SteelNest - Premium Recyclable Steel Home Organization
5. 选择 **Public**（或 Private）
6. ⚠️ **不要勾选**「Add a README file」「Add .gitignore」「Choose a license」
7. 点击 **「Create repository」**

#### 1.2 推送代码
1. 打开 **VS Code**
2. 点击顶部菜单 **「File」→「Open Folder」**
3. 选择 `C:\Users\86181\Desktop\独立站项目\steelnest` 文件夹
4. 点击 **「Terminal」→「New Terminal」**（或在 VS Code 中按 `Ctrl + \``）
5. 在终端中逐条输入以下命令（每输入一条按回车）：

```bash
git add -A
```

```bash
git commit -m "SteelNest v1.0 — full e-commerce site ready"
```

```bash
git branch -M main
```

```bash
git remote add origin https://github.com/你的GitHub用户名/steelnest.git
```

```bash
git push -u origin main
```

> ⚠️ 把「你的GitHub用户名」换成你实际的 GitHub 用户名！

6. 弹出 GitHub 登录窗口时，点击 **「Sign in with your browser」** 授权

---

### Mac 版本

同 Windows，把文件路径换成 Mac 的。其他步骤完全一样。

---

## 第二步：部署到 Vercel

### 2.1 导入项目
1. 打开 https://vercel.com 并登录（用 GitHub 账号）
2. 点击 **「Add New...」→「Project」**
3. 在列表中找到 **steelnest** 仓库，点击 **「Import」**
4. 配置页面：
   - Framework Preset：自动识别为 **Next.js**（不用改）
   - Root Directory：保持默认（不用改）
   - Build Command：保持默认 `next build`
   - Output Directory：保持默认
5. 点击 **「Deploy」**
6. 等待 1-2 分钟，看到 🎉 烟花动画就部署成功了！

### 2.2 设置环境变量（重要！）

部署成功后，需要配置环境变量：

1. 在 Vercel 项目页面，点击左侧 **「Settings」**
2. 点击 **「Environment Variables」**
3. 添加以下变量：

| Key | Value（开发/测试用） | 说明 |
|-----|---------------------|------|
| `NEXT_PUBLIC_SITE_URL` | `https://你的域名.vercel.app` | Vercel 自动分配的子域名 |
| `STRIPE_SECRET_KEY` | `sk_test_xxxxxxxx` | Stripe 测试密钥 |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_xxxxxxxx` | Stripe 公钥 |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | `sb-xxxxxxxx` | PayPal Sandbox ID |
| `PAYPAL_SECRET_KEY` | `xxxxxxxx` | PayPal Sandbox Secret |
| `NEXT_PUBLIC_GA_ID` | `G-XXXXXXXXXX` | Google Analytics ID（可选） |

4. 添加完后，点击 **「Save」**
5. ⚠️ **重要**：设置完环境变量后，需要重新部署一次才会生效：
   - 点击顶部 **「Deployments」**
   - 点击最新部署右边的 **「⋯」→「Redeploy」**

### 2.3 获得网站地址
部署成功后，Vercel 会给你一个地址，格式是：
```
steelnest-xxxxx.vercel.app
```
这就是你的临时网站地址，可以立刻访问！

---

## 第三步：绑定自己的域名

### 3.1 买域名
推荐的域名购买平台：
- **Cloudflare**：https://cloudflare.com （推荐，DNS 免费）
- **Namecheap**：https://namecheap.com

搜索 `steelnest.com`，如果被注册了就试 `steelnest.shop` 或 `steelneststore.com`。

### 3.2 在 Vercel 添加域名
1. 在 Vercel 项目页面，点击 **「Settings」→「Domains」**
2. 输入你买的域名，点击 **「Add」**
3. Vercel 会提示你配置 DNS 记录

### 3.3 配置 DNS（以 Cloudflare 为例）
1. 登录 Cloudflare，选择你的域名
2. 点击 **「DNS」→「Records」**
3. 添加两条记录：

| Type | Name | Content | Proxy Status |
|------|------|---------|--------------|
| CNAME | @ | cname.vercel-dns.com | Proxied |
| CNAME | www | cname.vercel-dns.com | Proxied |

4. 保存后等 2-5 分钟，刷新 Vercel 页面，域名状态变绿就成功了！

### 3.4 自动 SSL 证书
Vercel 会自动为你的域名配置 HTTPS（SSL 证书），不需要你做任何事。大约 5-10 分钟后生效。

---

## 第四步：上线后验证清单

上线后逐项检查：

- [ ] 首页能正常打开
- [ ] 产品列表页正常
- [ ] 产品详情页正常
- [ ] 购物车加购/修改数量/删除正常
- [ ] 结算页面正常
- [ ] Stripe 支付测试（测试模式）
- [ ] PayPal 支付测试（测试模式）
- [ ] 关于/联系/FAQ 页面正常
- [ ] HTTPS 小锁图标正常（域名绑定后）
- [ ] 手机端浏览正常

---

## 第五步：激活 Stripe 正式模式

上线前切换到 Stripe 正式模式：

1. 登录 https://dashboard.stripe.com
2. 点击「Activate your account」
3. 填写企业信息（个体工商户也可以）：
   - Business type：Individual / Sole Proprietorship
   - Business address：你的地址
   - Business details：跨境电商/零售
4. 提交身份证件
5. 审核通过后（通常 1-3 天）
6. 将 `.env.local` 和 Vercel 环境变量中的 `sk_test_` 换成 `sk_live_`，`pk_test_` 换成 `pk_live_`

---

## 第六步：提交 Google 搜索收录

1. 打开 https://search.google.com/search-console
2. 添加你的域名
3. 验证所有权（用 DNS 方式最简单）
4. 提交 sitemap：在 Search Console 中输入 `sitemap.xml`
5. Google 会在几天内开始收录你的页面

---

## 🎉 恭喜！

你的跨境电商独立站正式上线了！后续需要改内容、加产品、调样式，随时叫我。
