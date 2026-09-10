/**
 * 管理后台认证工具
 *
 * 单密码保护：生产环境必须配置 ADMIN_PASSWORD 环境变量；本地开发回退 admin123。
 * 登录后写入 httpOnly cookie，proxy.ts 与各 API 路由共用同一套 token 校验。
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_AUTH_COOKIE,
  ADMIN_COOKIE_MAX_AGE_SECONDS,
  createAdminToken,
  effectiveAdminPassword,
  verifyAdminToken,
} from "@/lib/admin-token";

/** 验证管理密码是否匹配 */
export function verifyAdminPassword(password: string): boolean {
  const configured = effectiveAdminPassword();
  return !!configured && password === configured;
}

/** 后台密码是否已配置（没配时给用户明确提示，而不是只说"密码错误"） */
export function isAdminPasswordConfigured(): boolean {
  return !!effectiveAdminPassword();
}

/** 管理员登录：设置 cookie */
export async function adminLogin(password: string): Promise<boolean> {
  if (!verifyAdminPassword(password)) return false;

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_AUTH_COOKIE, createAdminToken(password), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_COOKIE_MAX_AGE_SECONDS,
  });
  return true;
}

/** 检查当前请求是否已认证（Server Component / API 路由用） */
export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_AUTH_COOKIE);
  if (!token) return false;
  return verifyAdminToken(token.value, effectiveAdminPassword());
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
  cookieStore.delete(ADMIN_AUTH_COOKIE);
}
