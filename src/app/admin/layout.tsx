import AdminLayoutClient from "@/components/admin/AdminLayoutClient";
import type { ReactNode } from "react";

/**
 * 管理后台布局 — 所有 /admin/* 页面共用
 * 客户端组件负责判断是否显示侧边栏（登录页不显示）
 * 认证由 middleware.ts 统一处理（/admin/login 除外）
 */
export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
