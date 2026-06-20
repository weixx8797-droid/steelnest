"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";

// 导航链接 — 以后要加页面直接在这里加
const navLinks = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems, toggleCart } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="container-page flex items-center justify-between h-16 md:h-20">
        {/* ---- Logo ---- */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/logo-icon.svg"
            alt="SteelNest"
            width={36}
            height={36}
            priority
          />
          <span className="text-xl md:text-2xl font-bold text-brand-charcoal tracking-tight">
            SteelNest
          </span>
        </Link>

        {/* ---- 桌面导航 ---- */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-brand-steel hover:text-brand-copper transition-colors tracking-wide"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* ---- 右侧图标 ---- */}
        <div className="flex items-center gap-4">
          {/* 购物车图标 */}
          <button
            onClick={toggleCart}
            className="relative p-2 text-brand-steel hover:text-brand-copper transition-colors"
            aria-label="Open cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {/* 购物车数量角标 */}
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-brand-copper text-white text-[10px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center px-0.5">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </button>

          {/* ---- 汉堡菜单按钮（手机端） ---- */}
          <button
            className="md:hidden p-2 text-brand-charcoal"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ---- 手机端下拉菜单 ---- */}
      {menuOpen && (
        <nav className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="block text-sm font-medium text-brand-steel hover:text-brand-copper transition-colors py-2"
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
