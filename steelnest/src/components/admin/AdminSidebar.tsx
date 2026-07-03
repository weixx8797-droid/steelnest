"use client";

/**
 * 管理后台侧边栏导航
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

// 侧边栏菜单项
const menuItems = [
  {
    group: "概览",
    items: [
      { name: "仪表盘", href: "/admin", icon: "📊" },
      { name: "订单管理", href: "/admin/orders", icon: "📦" },
      { name: "产品管理", href: "/admin/products", icon: "🏷️" },
    ],
  },
  {
    group: "采购",
    items: [
      { name: "询盘管理", href: "/admin/inquiries", icon: "✉️" },
      { name: "供应商", href: "/admin/suppliers", icon: "🏭" },
      { name: "铺货中心", href: "/admin/sourcing", icon: "🚀" },
    ],
  },
  {
    group: "系统",
    items: [
      { name: "汇率看板", href: "/admin/exchange-rates", icon: "💱" },
      { name: "API用量", href: "/admin/api-usage", icon: "📊" },
      { name: "系统设置", href: "/admin/settings", icon: "⚙️" },
      { name: "ACCIO", href: "/admin/accio", icon: "🤖" },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-60 bg-brand-charcoal text-white flex flex-col shrink-0 min-h-screen">
      {/* Logo 区域 */}
      <div className="px-5 py-5 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-2.5">
          <Image src="/logo-icon.svg" alt="SteelNest" width={28} height={28} />
          <div>
            <div className="text-sm font-bold tracking-wide">SteelNest</div>
            <div className="text-[10px] text-brand-copper tracking-wider">
              管理后台
            </div>
          </div>
        </Link>
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {menuItems.map((group) => (
          <div key={group.group}>
            <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-2 mb-2">
              {group.group}
            </div>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors ${
                        active
                          ? "bg-brand-copper/20 text-brand-copper font-medium"
                          : "text-gray-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span className="text-base">{item.icon}</span>
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* 底部信息 */}
      <div className="px-5 py-3 border-t border-white/10 text-[10px] text-gray-500">
        <Link href="/" className="hover:text-brand-copper transition-colors">
          ← 返回独立站
        </Link>
      </div>
    </aside>
  );
}
