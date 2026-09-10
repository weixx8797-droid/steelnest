# 【改版记录】LabOrigin 品牌转型与内容改造

> 日期：2026-09-10
> 范围：`steelnest/` 前端从「SteelNest 铁皮柜 B2C 电商」全面转向「LabOrigin 培育钻石 ToB 门户」
> 依据：`独立站内容转换.txt` 的最终 ToB 方案

---

## 一、这次做了什么（概述）

把原来的钢制家居 B2C 电商站，改造成一个「河南培育钻石源头供应链门户」，定位为 **Source Agent & Quality Auditor（源头代理与质检商）**，面向海外珠宝商 / 独立设计师 / 品牌方。

三大方向已拍板：

1. **品牌**：SteelNest → **LabOrigin（源钻）**
2. **视觉**：黑白金极简（深夜黑 / 极简白 / 香槟金 / 炭灰）
3. **业务**：B2C 购物车/结账/支付 → **库存库 + 询价（Request a Quote）**

---

## 二、具体改动清单

### 1. 品牌与配色
- 品牌名 `SteelNest` → `LabOrigin`：全局替换（layout 元数据、Header/Footer、JSON-LD、settings.json、后台标题/侧边栏/登录页）。
- 邮箱域名**仍用原来的 `steelnest.com`**（`hello@` / `sourcing@` / `returns@` / `privacy@`），等拿到正式域名后全局替换即可。
- `src/app/globals.css` 配色 token 值换成黑白金（**token 名保留**，避免全站类名改动）：

  | token | 新值 | 用途 |
  |---|---|---|
  | `--color-brand-charcoal` | `#1A1A1A` | 深夜黑：导航/标题/Hero/Footer |
  | `--color-brand-steel` | `#333333` | 炭灰正文 |
  | `--color-brand-copper` | `#C5A059` | 香槟金：按钮/链接/标签 |
  | `--color-brand-leaf` | `#A8863D` | 深香槟：对勾/成功态 |
  | `--color-brand-cream` | `#FFFFFF` | 极简白页面底 |
  | `--color-brand-light` | `#F6F6F6` | 浅灰卡片底 |

- logo / favicon 换成金黑钻石切面 SVG（`public/logo-icon.svg`、`favicon.svg`）。
- 字体保留 Playfair Display（标题）+ Inter（正文）。

### 2. 页面（信息架构）
**新增 4 个支柱页**（`src/app/` 下）：
- `/capabilities` — 供应能力（"Direct from the World's Hub — Henan, China"）
- `/white-label` — 贴牌 / 代发 / 定制包装 / 镶嵌
- `/transparency` — 透明科普（4C、CVD vs HPHT、质检标准）
- `/case-studies` — 成功案例（社会证明）

**重写现有客户页**：首页、About、FAQ、Contact（→ Request a Quote）、Shipping、Returns、Privacy、Terms（全部 B2B 化：去掉 `$49/$5.99`，加 Incoterms / 账期 / 批发条款）。

**导航**：Header 改为 Home / Inventory / Capabilities / Transparency / Contact + 右上「Request a Quote」；移除购物车图标。Footer 链接同步更新。

### 3. 库存库（产品数据模型）
- `src/data/products.ts`：
  - `category`：`desk|storage|bathroom` → 8 种切型 `round|princess|oval|emerald|cushion|pear|marquise|radiant`
  - `specs`：`material/dimensions/weightCapacity/weight` → `shape/carat/color/clarity/cut/certificate`（+ 可选 polish/symmetry/fluorescence）
  - **删除 `colors` 字段**
- `src/data/products.json`：替换为 5 颗钻石样例（切型/克拉/颜色/净度/切工/证书齐全）。
- 前端：
  - `/shop` → 「Live Inventory」+ 切型筛选（真实按 `?category=` 过滤）
  - `/products/[slug]` → 钻石规格表 + 「Request a Quote」按钮（带 `?product=slug`）
  - `ProductCard` → 钻石卡片（切型 + 克拉 + 指示价 + "View & Quote"）
  - 后台「产品管理」表单字段同步改成钻石字段（shape/carat/color/clarity/cut/certificate + 8 种切型下拉）

### 4. 隐藏 B2C 流程
- 购物车 / 结账 / 支付（`cart`、`checkout`、`stripe`、`paypal` 路由与文件）**全部保留但隐藏停用**，导航与页脚已无入口，`robots.txt` 已拦截 `/cart`、`/checkout/`、`/api/`。
- 删除了 `src/components/AddToCartButton.tsx`（已无任何引用、且依赖被删的 `colors` 字段，属死代码）。

### 5. 询价表单接线
- 新增 `src/app/api/inquiries/route.ts`：`POST` 接收询价 → 追加写入 `src/data/inquiries.json` + 调 `sendEmail()` 发邮件。
- `src/components/ContactForm.tsx`：改成真实 RFQ 表单（姓名/公司/邮箱/国家/意向/数量/需求），提交到 `/api/inquiries`。

### 6. SEO
- `src/app/sitemap.ts` 更新为新 IA（新增 4 个支柱页）。
- `robots.ts` 不变（拦截规则仍正确）。
- 全仓搜索确认无 `SteelNest` / `steel over wood` / `recyclable steel` 残留（仅剩隐藏的购物车/结账文件里的旧色值，不影响前台）。

---

## 三、⚠️ 需要注意 / 待办事项

### 1. 最重要：Vercel Blob 会覆盖本地 products.json
`products.ts` 的逻辑是「有 `BLOB_READ_WRITE_TOKEN` 就优先读 Vercel Blob，否则读本地 `products.json`」。

- 本地开发：直接读你新改的 `products.json`，**没问题**。
- **线上 Vercel**：Blob 里还是**旧的钢制品数据**。上线后必须二选一：
  - 在后台「产品管理」里重新保存一次（会写回 Blob）；或
  - 清空 / 覆盖 Blob 里的 `products.json`。

否则线上库存页仍会显示钢制品。

### 2. 邮箱域名
已按你的要求**继续用 `steelnest.com`**。等有了正式域名，全局搜索 `steelnest.com` 一键替换即可（分布在 `structured-data.tsx`、`Footer.tsx`、`contact/shipping/returns/privacy/terms` 等页面）。

### 3. 产品图是占位图
现在所有钻石用的是 `public/products/diamond-placeholder.svg`（一张黑金示意插画），**不是真实火彩图**。需要后续：
- 用 AI 生成，或
- 向工厂要 360° 高清火彩图/视频素材。

替换后把 `products.json` 里每颗钻的 `images` 换成真实图（或外链 URL / base64）。

### 4. 首页工厂素材占位
首页「Who We Are」区块有 `Your factory footage here` 占位块，等你拍好河南工厂/质检短视频后替换成视频或实拍图。

### 5. 后台「铺货中心 / AI 分析」仍是钢制品内部逻辑
`admin/sourcing`（铺货中心）和 `api/admin/ai-analyze` 只改了品牌名与提示词，**内部切型/规格字段未深改**（属计划内「后续阶段」）。不影响前台，但如果你要用这个自动上架功能，需要再单独改造。

### 6. 询价邮件依赖 Resend
`/api/inquiries` 未配置 `RESEND_API_KEY` 时，`sendEmail()` 会降级为**控制台打印，不真发邮件**（方便本地测流程）。要真发邮件，需在 `.env.local` 配 `RESEND_API_KEY` + 验证域名 + 填 `settings.json` 里的 `senderEmail`。

### 7. 配色 token 名保留了「steel/copper」等旧名
为了不动全站类名，token 名（`--color-brand-steel` 等）没改，只是改了值。如果将来想彻底去掉「steel」字样，需要全局替换所有 `text-brand-steel` / `bg-brand-copper` 等类名。

### 8. 计划内明确不做的（后续阶段）
- 完整「供应商 CRUD + 询盘→报价 pipeline」（`suppliers`/`quotes`/`inquiries` 目前是空壳，`email-worker/` Python 脚本未接入）
- 实时库存表（B2B 登录专区）、河南市场指数周报、PDF 白皮书 Lead Magnet、LinkedIn/YouTube 内容同步

---

## 四、验证结果

- ✅ `npm run build` 通过（Next.js 16.2.9，TypeScript 无错误，49 个页面生成）
- ✅ 新增页面 `/capabilities` `/white-label` `/transparency` `/case-studies` 均已生成
- ✅ 全站无 `SteelNest` / 钢制文案残留
- ✅ 询价按钮跳转 `/contact?product=slug`，表单提交到 `/api/inquiries`

---

## 五、第二轮修复（2026-09-10 复审后）

针对复审提出的 P0/P1 问题，本轮修复：

1. **询盘写入 Blob 化**：新增 `src/lib/inquiries.ts`（与 orders/products 同款「有 `BLOB_READ_WRITE_TOKEN` 优先 Blob，否则本地文件」逻辑），`/api/inquiries` 改用 `addInquiry()`，线上 Vercel 不再因只读文件系统 500。
2. **询盘通知发站长**：`/api/inquiries` 现在
   - 发站长通知到 `INQUIRY_NOTIFY_EMAIL` 环境变量（未配置则只打印日志）；
   - 同时给客户发一封确认信（受 Resend 发件人验证限制，见下）。
   - 邮件 HTML 已做 `escapeHtml` 转义，防用户输入注入。
3. **后台询盘页启用**：`src/app/admin/inquiries/page.tsx` 从占位页改为真实列表（读 `readInquiries()`，按时间倒序，含姓名/公司/邮箱/WhatsApp/国家/意向/数量/需求/时间）。
4. **域名统一 `steelneststore.com`**：全站邮箱 `@steelnest.com` → `@steelneststore.com`（与线上域名一致）；`.env.local.example` 更新为 LabOrigin 并新增 `RESEND_API_KEY` / `INQUIRY_NOTIFY_EMAIL` 说明。
5. **结构化数据去掉指示价**：`ProductJsonLd` 不再把 `product.price`（指示价）当 Offer 真价报给 Google，只保留库存状态，避免价格不符判定。
6. **错字 + WhatsApp**：`Bulk / parall program` → `Bulk / parcel program`；联系页新增 WhatsApp 联系方式、询价表单新增 WhatsApp（选填）字段。
7. **遗留 B2C 代码与旧数据**：按你的决定**暂保留**（cart/checkout/stripe/paypal 代码、orders.json/suppliers.json 旧样例均未删除）。

### 仍未决 / 需你配置
- **`INQUIRY_NOTIFY_EMAIL`**：站长发件通知的接收邮箱，需在 Vercel 环境变量里配置。
- **`RESEND_API_KEY` + `settings.json` 的 `email.senderEmail`**：不配则 `sendEmail` 只打印日志；配了 key 但 senderEmail 为空时只能用 Resend 测试发件人，客户可能收不到确认信。
- **WhatsApp 号**：联系页当前是占位号 `+86 138 0000 0000`，需换成真实号。
- **`NEXT_PUBLIC_SITE_URL`**：上线设为 `https://steelneststore.com`，否则 OG/canonical/sitemap 会用 localhost。

---

## 六、ToB 询盘报价 SOP（操作手册）

> 原则：**邮件为骨，WhatsApp 为魂** —— WhatsApp 做售前沟通/视觉演示/情感建立，Email 做合同确认/发票/正式存档。

### 询价表单字段（已落地）
前台「Request a Quote」表单必填：**联系人姓名、公司/工作室、Email、WhatsApp、主要市场** + 需求描述；选填：意向、预估数量。

### 标准流程
1. **获客**：客户在独立站填表（线索进 `inquiries.json`/Blob + 后台「询盘管理」可见 + 站长收到通知邮件）。
2. **响应**（1 小时内）：Email 发欢迎信（附公司简介 PDF）+ WhatsApp 加好友打招呼。
3. **选品**：WhatsApp 发客户感兴趣的裸钻**实拍火彩视频 + IGI 证书截图**。
4. **锁单**：客户确认款式后，Email 发正式 **Proforma Invoice（形式发票）**。
5. **付款与发货**：客户打款 → WhatsApp 发打包视频 + FedEx 运单号。

### 关键细节（人工操作时注意）
- **WhatsApp Business 动态**：天天发「新到裸钻」，别发生活照 —— 建立「货源充足源头商」人设。
- **邮件签名**：必须带洛阳/郑州办公室地址 + LinkedIn 链接（实体背书）。
- **报价时效**：报价单注明 `Validity: 48 Hours`（48 小时有效），逼单同时保护利润。
- **防诈骗**：明确告知客户「一切付款以邮件 Invoice 为准」，防止 WhatsApp 账号被盗导致的资金风险。

> ⚠️ 待你补充的实体信息：公司简介 PDF、洛阳/郑州办公地址、LinkedIn 主页、真实 WhatsApp 号（联系页当前是占位号）。

---

## 七、第三轮修复（2026-09-10 复审后，代码层能改的都改了）

### 1. 站点地址不再被预览域名劫持（重要）

问题：线上 `sitemap.xml` / `og:url` 全部指向 `https://steelnest.vercel.app`，因为 Vercel 环境变量 `NEXT_PUBLIC_SITE_URL` 配的是 vercel 预览域名。搜索引擎会把预览域名当成正式站收录，和 `www.steelneststore.com` 互相抢排名。

修复：新增 `src/lib/site.ts`，统一提供 `getSiteUrl()` / `absoluteUrl()`：

- `NEXT_PUBLIC_SITE_URL` 若被配成 `*.vercel.app`，自动忽略，回落到 `https://www.steelneststore.com`；
- 本地开发仍用 `http://localhost:3000`；
- `layout.tsx` / `robots.ts` / `sitemap.ts` / `structured-data.tsx` / 产品详情页全部改走这个函数；
- 同时补上 `metadataBase`，分享图绝对地址在预览部署里也不会写成 localhost。

> 建议仍去 Vercel 把 `NEXT_PUBLIC_SITE_URL` 改成 `https://www.steelneststore.com`，代码兜底只是保险。

### 2. 询盘邮件失败不再误报"提交失败"

问题：`/api/inquiries` 里两处 `sendEmail` 没有错误处理。Resend 一旦报错（域名未验证、key 失效），接口返回 500，客户看到"提交失败"就会重发，但询盘其实已经写进存储了，造成重复线索。

修复：站长通知和客户确认信分别包 `try/catch`，失败只写服务端日志，询盘照常返回成功。数据已入库，后台「询盘管理」始终看得到。

### 3. 全站再扫一遍的修复

| 项 | 原状 | 现在 |
| --- | --- | --- |
| 案例页错别字 | `Bulk parall program` | `Bulk / parcel program` |
| 案例页文案 | 宣称"真实客户成果 + 可提供推荐人" | 改为「合作模式 / Engagement Models」叙述，不宣称真实客户 |
| 联系页 WhatsApp | 占位号 `+86 138 0000 0000` | 移除，拿到真实号再加回 |
| 邮箱口径 | `hello@` / `sourcing@` 混用 | 统一 `sourcing@steelneststore.com`（privacy 页保留 `privacy@`） |
| 购物车 / 结账页 | `/cart` `/checkout` 仍可访问 | 308 跳转到 `/contact`，见 `next.config.ts` |
| 后台被收录 | `robots.txt` 未屏蔽 `/admin` | 已加入 `Disallow: /admin` |
| 产品结构化数据 | 有 `offers` 但无 `price` | 去掉 `offers`，避免 Google "缺少 price" 报错 |
| 产品 OG 图 | 域名和图片地址拼接两次 | 新增 `absoluteUrl()`，兼容 Blob 绝对地址 |
| 分享预览图 | 200x200 的 SVG（各平台不渲染） | 新增 `src/app/opengraph-image.tsx`，1200x630 PNG，Twitter 卡片改 `summary_large_image` |
| 后台文案 | "三层不锈钢置物架""加厚冷轧钢" | 换成钻石参数示例 |
| 后台分类 | 桌面收纳 / 储物 / 卫浴 | 裸钻 / 成品首饰 / 白标代发 / 碎钻 |
| AI 分析默认值 | 分类 `desk`、售价 `29.99` | 分类 `round`、售价 `0`（待人工填） |

### 4. 本轮验证结果

- `npm run build` 通过，50 个路由无 TypeScript 报错；
- 本地生产模式实测：`/robots.txt` 已含 `Disallow: /admin`；`/sitemap.xml` 全部为 `https://www.steelneststore.com`；
- `/cart`、`/checkout` 返回 `308 -> /contact`；
- `/opengraph-image` 返回 `200`、`image/png`、53KB，已人工确认渲染无错版；
- 首页 `og:image` / `twitter:image` 已是正式域名。

### 5. 本轮仍未解决（需要你本人操作）

1. **推送到 GitHub**：改版内容此前一直停留在本地未提交，Vercel 因此没有重新构建，`www.steelneststore.com` 展示的仍是旧的 SteelNest 站点。
2. **Resend 域名验证 + `settings.json` 的 `email.senderEmail`**：不填真实发件人，客户确认信发不出去（Resend 测试发件人只能发给账号本人）。
3. **`INQUIRY_NOTIFY_EMAIL` / `RESEND_API_KEY`**：必须在 Vercel 环境变量里存在，否则一个询盘通知都收不到。
4. **真实产品实拍图**：目前 5 个产品全部使用 `diamond-placeholder.svg`，`public/` 目录下一张实拍照片都没有。
5. **真实 WhatsApp 号**：表单仍要求客户填 WhatsApp，但站点自身没有对外号码。
