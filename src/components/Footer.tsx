"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-brand-charcoal text-white mt-auto">
      <div className="container-page py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* ---- 品牌介绍 ---- */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold tracking-wide">SteelNest</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Steel over wood. Stronger homes, fewer trees. We craft premium
              recyclable steel organization products — durable, sustainable,
              designed to last.
            </p>
          </div>

          {/* ---- 快速链接 ---- */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-brand-copper tracking-wider uppercase">
              Shop
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/shop"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=storage"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Storage Racks
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=desk"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Desk Organizers
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=bathroom"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Bathroom Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* ---- 客服链接 ---- */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-brand-copper tracking-wider uppercase">
              Support
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/shipping"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* ---- 订阅 ---- */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-brand-copper tracking-wider uppercase">
              Stay Connected
            </h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              Join our newsletter for new arrivals and exclusive offers.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 text-sm bg-white/10 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-brand-copper"
              />
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium bg-brand-copper text-white rounded-md hover:bg-[#B8953E] transition-colors"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* ---- 底部 ---- */}
        <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} SteelNest. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-xs text-gray-500 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-gray-500 hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
