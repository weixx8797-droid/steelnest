"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// 导航链接 — 以后要加页面直接在这里加
const navLinks = [
  { name: "Home", href: "/" },
  { name: "Inventory", href: "/shop" },
  { name: "Capabilities", href: "/capabilities" },
  { name: "Transparency", href: "/transparency" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-brand-cream/90 backdrop-blur-md border-b border-brand-charcoal/10">
      <div className="container-page flex items-center justify-between h-16 md:h-20">
        {/* ---- Logo ---- */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <Image
            src="/logo-icon.svg"
            alt="LabOrigin"
            width={34}
            height={34}
            priority
          />
          <span className="font-serif text-xl md:text-2xl text-brand-charcoal tracking-tight">
            LabOrigin
          </span>
        </Link>

        {/* ---- 桌面导航 ---- */}
        <nav className="hidden md:flex items-center gap-9">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="group relative text-[13px] font-medium text-brand-steel hover:text-brand-charcoal transition-colors tracking-wide"
            >
              {link.name}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-brand-copper transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* ---- 右侧 CTA ---- */}
        <div className="flex items-center gap-5">
          <Link
            href="/contact"
            className="hidden sm:inline-flex items-center px-6 py-2.5 text-[13px] font-medium tracking-wide text-brand-charcoal border border-brand-charcoal/20 rounded-sm hover:border-brand-copper hover:text-brand-copper transition-colors"
          >
            Request a Quote
          </Link>

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
                strokeWidth="1.5"
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
                strokeWidth="1.5"
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
        <nav className="md:hidden bg-brand-cream border-t border-brand-charcoal/10 px-6 py-4 space-y-3">
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
          <Link
            href="/contact"
            className="block text-sm font-medium text-brand-copper py-2"
            onClick={() => setMenuOpen(false)}
          >
            Request a Quote →
          </Link>
        </nav>
      )}
    </header>
  );
}
