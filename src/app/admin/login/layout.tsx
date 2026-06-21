/**
 * 登录页面的独立布局 — 不需要认证（否则无限重定向）
 */

import type { ReactNode } from "react";

export default function LoginLayout({ children }: { children: ReactNode }) {
  // 不调用 requireAdmin()，直接渲染登录表单
  return <>{children}</>;
}
