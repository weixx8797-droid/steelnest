"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-brand-charcoal text-white mt-auto">
      <div className="container-page py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* ---- 品牌介绍 ---- */}
          <div className="space-y-5">
            <h3 className="font-serif text-xl tracking-tight">LabOrigin</h3>
            <p className="text-sm text-white/50 leading-relaxed">
              Lab-grown diamond sourcing, quality auditing, and white-label
              manufacturing — direct from Henan, China, the world&apos;s hub of
              HPHT &amp; CVD production.
            </p>
          </div>

          {/* ---- 探索链接 ---- */}
          <div className="space-y-5">
            <h4 className="text-xs text-white/40 tracking-wide">Explore</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/shop" className="text-sm text-white/70 hover:text-brand-copper transition-colors">
                  Live Inventory
                </Link>
              </li>
              <li>
                <Link href="/capabilities" className="text-sm text-white/70 hover:text-brand-copper transition-colors">
                  Source Capability
                </Link>
              </li>
              <li>
                <Link href="/white-label" className="text-sm text-white/70 hover:text-brand-copper transition-colors">
                  White Label
                </Link>
              </li>
              <li>
                <Link href="/transparency" className="text-sm text-white/70 hover:text-brand-copper transition-colors">
                  Transparency Hub
                </Link>
              </li>
              <li>
                <Link href="/case-studies" className="text-sm text-white/70 hover:text-brand-copper transition-colors">
                  Case Studies
                </Link>
              </li>
            </ul>
          </div>

          {/* ---- 客服链接 ---- */}
          <div className="space-y-5">
            <h4 className="text-xs text-white/40 tracking-wide">Support</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/faq" className="text-sm text-white/70 hover:text-brand-copper transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-sm text-white/70 hover:text-brand-copper transition-colors">
                  Shipping &amp; Logistics
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-white/70 hover:text-brand-copper transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-white/70 hover:text-brand-copper transition-colors">
                  Request a Quote
                </Link>
              </li>
            </ul>
          </div>

          {/* ---- 联系方式 ---- */}
          <div className="space-y-5">
            <h4 className="text-xs text-white/40 tracking-wide">Get in touch</h4>
            <p className="text-sm text-white/50 leading-relaxed">
              For sourcing, auditing, and white-label inquiries:
            </p>
            <a
              href="mailto:sourcing@steelneststore.com"
              className="text-sm text-white/80 hover:text-brand-copper transition-colors"
            >
              sourcing@steelneststore.com
            </a>
            <div>
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-2.5 text-sm font-medium border border-brand-copper/50 text-brand-copper rounded-sm hover:bg-brand-copper hover:text-white transition-colors"
              >
                Request a Quote
              </Link>
            </div>
          </div>
        </div>

        {/* ---- 底部 ---- */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} LabOrigin. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link
              href="/privacy"
              className="text-xs text-white/40 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-white/40 hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
