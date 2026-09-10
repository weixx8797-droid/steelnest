/**
 * Next.js Proxy — 管理后台路由保护（替代废弃的 middleware.ts）
 *
 * /admin/* 需要「有效」的登录 cookie，/admin/login 本身不保护。
 *
 * 注意：这里必须校验 token 内容，只判断 cookie 是否存在等于没锁。
 * 曾经的写法只要随便塞一个 admin_auth_token 就能打开后台页面。
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ADMIN_AUTH_COOKIE,
  effectiveAdminPassword,
  verifyAdminToken,
} from "@/lib/admin-token";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 只保护 /admin 路径
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  // 登录页不需要保护
  if (pathname === "/admin/login") return NextResponse.next();

  const token = request.cookies.get(ADMIN_AUTH_COOKIE);
  if (!verifyAdminToken(token?.value, effectiveAdminPassword())) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
