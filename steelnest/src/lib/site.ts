/**
 * 站点对外绝对地址（canonical / sitemap / OG / 结构化数据共用）。
 *
 * 生产环境若把 NEXT_PUBLIC_SITE_URL 配成 *.vercel.app，搜索引擎会把预览域名
 * 当成正式站点收录，和自有域名互相抢排名。这里统一兜底到正式域名，
 * 预览部署不再对外暴露为规范地址。
 */
const PRODUCTION_URL = "https://www.steelneststore.com";

function isPreviewHost(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return hostname === "vercel.app" || hostname.endsWith(".vercel.app");
  } catch {
    return false;
  }
}

export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");

  if (configured && !isPreviewHost(configured)) return configured;
  if (process.env.NODE_ENV !== "production") return "http://localhost:3000";
  return PRODUCTION_URL;
}

/**
 * 把可能是相对路径的图片地址补成绝对地址。
 * 后台上传到 Blob 的图片本身就是完整 URL，直接返回，避免拼成
 * "https://域名https://blob地址" 这种坏链接。
 */
export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${getSiteUrl()}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}
