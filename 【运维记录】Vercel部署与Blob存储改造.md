# SteelNest Vercel 部署与 Vercel Blob 存储改造记录

> 记录时间：2026-06 ~ 2026-09  
> 项目路径：`steelnest/`（Git 仓库根为 `独立站项目/`）

---

## 1. Vercel 全站 404

### 症状
- 部署成功，但打开网站所有页面都是 404。

### 根因
- `steelnest/vercel.json` 里错误配置了：

```json
{
  "outputDirectory": ".next"
}
```

- Next.js 项目部署到 Vercel 时，构建产物不能当成普通静态目录托管。
- 设置 `outputDirectory: ".next"` 后，Vercel 不再走 Next.js Serverless Runtime，而是尝试直接服务 `.next/` 下的静态文件，导致所有路由 404。

### 修复
- 删除 `outputDirectory` 字段，保留：

```json
{
  "framework": "nextjs",
  "buildCommand": "next build",
  "installCommand": "npm install"
}
```

---

## 2. vercel.json 报“文件无效”

### 症状
- 修复后重新部署，构建阶段报：`提供的 vercel.json 文件无效`。

### 根因
- 使用 PowerShell `Set-Content -Encoding UTF8` 写文件时，文件头被加上了 UTF-8 BOM（`EF BB BF`）。
- Vercel 解析 JSON 时不接受 BOM，导致文件无效。

### 修复
- 用不带 BOM 的 UTF-8 重写 `vercel.json`。
- 后续所有源码文件修改都避免写入 BOM。

---

## 3. 仓库与 Vercel 根目录调整

- Git 仓库根：`C:\Users\86181\Desktop\独立站项目`
- Next.js 项目实际位于：`steelnest/`
- 根目录新增 `vercel.json`：

```json
{
  "rootDirectory": "steelnest"
}
```

- `steelnest/vercel.json` 只负责 Next.js 构建配置。

---

## 4. 线上文件系统只读 → 接入 Vercel Blob

### 为什么改
- 原实现把后台编辑结果写回 `src/data/*.json`（本地文件）。
- Vercel Serverless 环境文件系统只读，线上保存产品/订单会失败。
- 需要持久化存储，方案选择 Vercel Blob。

### 改造思路
- 线上（存在 `BLOB_READ_WRITE_TOKEN`）：读写 Vercel Blob。
- 本地开发（无 token）：继续读写本地 `src/data/*.json`，方便调试。
- 首次上线 Blob 为空时，读取自动回退到仓库内打包的本地 JSON 作为种子数据。

### 涉及文件
| 文件 | 说明 |
| --- | --- |
| `steelnest/src/data/products.ts` | 产品数据读写：Blob 优先，本地回退 |
| `steelnest/src/lib/orders.ts` | 订单数据读写：Blob 优先，本地回退 |
| `steelnest/src/app/api/orders/route.ts` | 顾客下单接口（`POST /api/orders`） |
| `steelnest/src/app/api/admin/orders/route.ts` | 后台订单管理接口 |
| `steelnest/src/app/api/admin/products/route.ts` | 后台产品管理接口 |
| `steelnest/src/components/CheckoutForm.tsx` | 结算页增加收货地址并创建订单 |

### 异步化
- `products.ts`、`orders.ts` 读写函数改为 `async`。
- 所有页面、API、`generateStaticParams`、`sitemap.ts` 的调用点补齐 `await`。
- 前台首页/商品页/店铺页、后台首页设为动态渲染，保证后台编辑后前台立即生效。

---

## 5. Blob 覆盖限制（关键坑）

### 症状
- 后台保存产品报错：

```text
Vercel Blob: This blob already exists, use `allowOverwrite: true`
```

### 根因
- Vercel Blob 默认不允许覆盖同 pathname 的已有文件。
- 产品和订单每次保存都会写同一个固定文件：`products.json`、`orders.json`。

### 修复
- `put()` 增加：

```ts
allowOverwrite: true,
```

- 涉及文件：
  - `steelnest/src/data/products.ts`
  - `steelnest/src/lib/orders.ts`

---

## 6. 图片上传 413（Payload Too Large）

### 症状
- 后台新增产品报：`❌ 新增失败：状态 413`。

### 根因
- 旧实现把图片读成 base64，再塞进产品 JSON 一起 POST。
- base64 比原图大约 33%，容易超过 Vercel 请求体限制（约 4.5MB）。

### 修复
- 新增图片上传接口：`POST /api/admin/upload-image`
  - 接收 `multipart/form-data`，字段名 `file`
  - 单张限制 3MB
  - 支持 JPG / PNG / WebP / GIF
  - 上传成功返回图片 URL，产品 JSON 只存 URL
- 后台新增/编辑弹窗的“上传图片”改为先上传拿 URL，再保存产品。
- 本地开发无 Blob token 时，图片回退保存到 `public/uploads/`，并加入 `.gitignore`。

---

## 7. 私有/公开 Blob Store 分离

### 问题
- 数据 store 创建为 Private（订单、产品 JSON 需要私有）。
- 产品图片需要公开 URL，上传时报：

```text
Cannot use public access on a private store
```

### 架构
| Store | Access | 用途 | 环境变量前缀 |
| --- | --- | --- | --- |
| 数据 Blob Store | Private | `products.json`、`orders.json` | 默认（`BLOB_*`） |
| 图片 Blob Store | Public | 产品图片 | `PRODUCT_IMG_` |

- 图片上传接口优先读取 `PRODUCT_IMG_READ_WRITE_TOKEN`，并调用：

```ts
put(filename, buffer, {
  access: "public",
  contentType: file.type,
  token: process.env.PRODUCT_IMG_READ_WRITE_TOKEN,
});
```

### 环境变量清单
- `BLOB_READ_WRITE_TOKEN`：Private 数据 store 读写 token
- `BLOB_STORE_ID`：Private 数据 store ID
- `PRODUCT_IMG_READ_WRITE_TOKEN`：Public 图片 store 读写 token
- `PRODUCT_IMG_STORE_ID`：Public 图片 store ID
- `ADMIN_PASSWORD`：后台管理密码（未配置时默认 `admin123`）
- `RESEND_API_KEY`：可选，发货邮件使用；未配置时仅打印日志

---

## 8. 后台产品规格编辑

### 背景
- 前台产品详情页展示 `Specifications`（Material / Dimensions / Weight Capacity）。
- 原后台新增/编辑弹窗没有规格输入入口。

### 修复
- 在后台「新增产品」和「编辑产品」弹窗中加入“规格参数”区：
  - 材质 `material`
  - 尺寸 `dimensions`
  - 承重 `weightCapacity`
  - 重量 `weight`（可选）
- 提交时写入产品 `specs` 字段。
- API 层 `PUT /api/admin/products` 原本已放行 `specs`，无需改动。

---

## 9. 部署与验证流程

1. 修改代码后执行本地构建：

```bash
cd C:\Users\86181\Desktop\独立站项目\steelnest
npm run build
```

2. 提交并推送（仓库根目录执行）：

```bash
git add -A
git commit -m "描述改动"
git push origin master
```

3. Vercel 自动部署，或到 Vercel 后台手动 Redeploy。
4. 线上验证：
   - 首页/店铺/商品详情可打开
   - 后台登录、新增/编辑产品可保存
   - 上传图片可显示
   - 下一笔模拟订单并确认后台可见

### 注意事项
- Git 全局配置了代理 `127.0.0.1:7897`，推送前需确保代理已开启。
- `.next` 缓存损坏会导致构建报奇怪类型错误，可删除 `steelnest/.next` 后重新构建。
- `next-env.d.ts` 是 Next.js 自动生成文件，不要提交本地 dev 路径版本。

---

## 10. 相关提交

主要提交（按时间顺序）：
- 修复 `vercel.json` outputDirectory 与 BOM
- 增加根目录 `vercel.json`（`rootDirectory: steelnest`）
- 产品/订单数据接入 Vercel Blob，本地文件回退
- 图片上传接口 + 公开图片 Blob store
- 后台新增产品规格编辑
- 保存失败时显示服务端错误详情
- `allowOverwrite: true` 修复 Blob 覆盖