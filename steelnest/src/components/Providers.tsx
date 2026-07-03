"use client";

import { CartProvider } from "@/lib/cart-context";
import CartDrawer from "@/components/CartDrawer";
import type { ReactNode } from "react";

/**
 * 客户端全局 Provider 包裹层
 * 所有需要交互能力的全局状态都放这里
 */
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      {children}
      {/* 购物车侧边抽屉 — 全局可用 */}
      <CartDrawer />
    </CartProvider>
  );
}
