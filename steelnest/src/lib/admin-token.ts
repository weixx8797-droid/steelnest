/**
 * 后台登录 cookie 的编解码与校验。
 *
 * 这里刻意不引入任何 Node 专有 API（fs / Buffer / next/headers），
 * 因为 proxy.ts 跑在 Edge Runtime，需要和 API 路由共用同一套校验逻辑。
 * 之前的漏洞：proxy 只判断 cookie「存在」，不判断是否有效，
 * 于是随便塞一个 admin_auth_token 就能打开后台页面。
 */

export const ADMIN_AUTH_COOKIE = "admin_auth_token";
export const ADMIN_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24; // 24 小时

/**
 * 当前生效的管理密码。
 * 生产环境没配 ADMIN_PASSWORD 时返回 undefined，任何密码都登不进去；
 * 本地开发回退 admin123 方便调试。
 */
export function effectiveAdminPassword(): string | undefined {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  return process.env.NODE_ENV === "production" ? undefined : "admin123";
}

/**
 * 用 base64url 而不是标准 base64：
 * Next.js 写 cookie 时会把标准 base64 里的 "+" "/" "=" 转义成 %2B %2F %3D，
 * 读回来时并不是原始字符串，导致校验永远失败。base64url 只含 [A-Za-z0-9-_]，
 * 不会被 cookie 编码破坏。
 */
function toBase64Url(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromBase64Url(value: string): string | null {
  try {
    // 兼容已经被 URL 编码过的旧 cookie
    const normalized = value.includes("%") ? decodeURIComponent(value) : value;
    const standard = normalized.replace(/-/g, "+").replace(/_/g, "/");
    const padded = standard + "=".repeat((4 - (standard.length % 4)) % 4);
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
}

/** 生成登录 token：base64("<密码>:<签发时间>") */
export function createAdminToken(password: string): string {
  return toBase64Url(`${password}:${Date.now()}`);
}

/**
 * 校验 token：密码必须与当前配置一致，且未超过 24 小时。
 * 未配置密码时一律返回 false（宁可不放行）。
 */
export function verifyAdminToken(
  token: string | undefined | null,
  configuredPassword: string | undefined
): boolean {
  if (!token || !configuredPassword) return false;

  const decoded = fromBase64Url(token);
  if (!decoded) return false;

  // 密码本身可能含冒号，所以从最后一个冒号切分
  const separator = decoded.lastIndexOf(":");
  if (separator <= 0) return false;

  const password = decoded.slice(0, separator);
  const issuedAt = Number(decoded.slice(separator + 1));
  if (!Number.isFinite(issuedAt)) return false;
  if (Date.now() - issuedAt > ADMIN_COOKIE_MAX_AGE_SECONDS * 1000) return false;

  return password === configuredPassword;
}
