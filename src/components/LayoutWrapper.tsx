"use client";

/**
 * 布局选择器 — 根据路径决定用顾客端布局还是管理后台布局
 *
 * /admin/* → 不显示 Header/Footer（管理后台有自己的侧边栏）
 * 其他路径  → 正常顾客端布局
 */

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import type { ReactNode } from "react";

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    // 管理后台：用自己的 AdminLayout，不包裹 Header/Footer/Providers
    return <>{children}</>;
  }

  // 顾客端：Header + 主内容 + Footer + 购物车 Provider
  return (
    <Providers>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </Providers>
  );
}
