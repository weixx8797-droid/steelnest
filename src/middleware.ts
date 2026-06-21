/**
 * Next.js Middleware — 管理后台路由保护
 *
 * /admin/* 路径需要登录后才能访问
 * /admin/login 不需要保护（登录页本身）
 * /api/admin/* 同样需要认证
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE = "admin_auth_token";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 只保护 /admin 路径
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  // 登录页不需要保护
  if (pathname === "/admin/login") return NextResponse.next();

  // 检查 auth cookie
  const token = request.cookies.get(AUTH_COOKIE);
  if (!token) {
    const loginUrl = new URL("/admin/login", request.url);
    // 登录成功后跳回原页面
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
