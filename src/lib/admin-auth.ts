/**
 * 管理后台认证工具
 *
 * 极简方案：单密码保护，设环境变量 ADMIN_PASSWORD 即可
 * 登录后设置一个 httpOnly cookie，middleware 校验
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "admin_auth_token";
// cookie 有效期：24 小时
const COOKIE_MAX_AGE = 60 * 60 * 24;

/** 验证管理密码是否匹配 */
export function verifyAdminPassword(password: string): boolean {
  const correct = process.env.ADMIN_PASSWORD || "admin123";
  return password === correct;
}

/** 生成简单的 auth token（生产环境可改用 JWT） */
function generateToken(password: string): string {
  // 简单方案：Base64 编码的密码 + 时间戳
  const payload = `${password}:${Date.now()}`;
  return Buffer.from(payload).toString("base64");
}

/** 验证 token 是否有效 */
function verifyToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [password, timestamp] = decoded.split(":");
    const elapsed = Date.now() - parseInt(timestamp);
    // token 24 小时内有效
    return verifyAdminPassword(password) && elapsed < COOKIE_MAX_AGE * 1000;
  } catch {
    return false;
  }
}

/** 管理员登录：设置 cookie */
export async function adminLogin(password: string): Promise<boolean> {
  if (!verifyAdminPassword(password)) return false;

  const token = generateToken(password);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
  return true;
}

/** 检查当前请求是否已认证（middleware / Server Component 用） */
export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME);
  if (!token) return false;
  return verifyToken(token.value);
}

/** 要求登录，未认证则跳转到 /admin/login */
export async function requireAdmin(): Promise<void> {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    redirect("/admin/login");
  }
}

/** 管理员登出：清除 cookie */
export async function adminLogout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
