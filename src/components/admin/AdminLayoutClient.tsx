"use client";

/**
 * 管理后台布局 — 客户端部分
 * 登录页隐藏侧边栏和顶栏，其他页面正常显示
 */

import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import type { ReactNode } from "react";

export default function AdminLayoutClient({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  // 登录页：纯内容，不显示侧边栏
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // 其他管理页面：侧边栏 + 顶栏 + 内容
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
