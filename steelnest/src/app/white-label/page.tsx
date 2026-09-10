import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "White Label & OEM",
  description:
    "LabOrigin white-label and OEM services — dropshipping, custom packaging, and setting services for lab-grown diamond jewelry brands.",
};

export default function WhiteLabelPage() {
  return (
    <div className="bg-brand-cream">
      {/* ====== Hero ====== */}
      <section className="bg-brand-charcoal text-white">
        <div className="container-page py-20 md:py-28">
          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-brand-copper" />
            <span className="font-serif italic text-brand-copper/90 text-sm tracking-wide">
              White label &amp; OEM
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl leading-[1.1] mt-6">
            We empower your
            <br />
            <span className="text-gold">jewelry brand.</span>
          </h1>
          <p className="text-white/60 max-w-2xl mt-6 leading-relaxed">
            You own the brand and the customers. We own the supply chain —
            stones, settings, packaging, and fulfillment. Launch or scale a
            lab-grown diamond line without holding inventory.
          </p>
        </div>
      </section>

      {/* ====== 服务列表 ====== */}
      <section className="container-page py-20 md:py-24">
        <div className="space-y-6">
          {[
            {
              title: "Dropshipping",
              desc: "We ship directly to your end customer under your brand. No stock on your side — you sell, we source and fulfill.",
            },
            {
              title: "Custom Packaging",
              desc: "Logo-printed boxes, branded cards, and presentation kits that turn every unboxing into your brand moment.",
            },
            {
              title: "Setting & Mounting",
              desc: "Partner setting factories in Shenzhen and Guangzhou produce finished rings, earrings, and pendants to your design.",
            },
            {
              title: "Private Label",
              desc: "Fully unbranded stones and jewelry, labeled and certificated exactly how you want them.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="grid md:grid-cols-[auto_1fr] gap-8 items-start py-8 border-b border-brand-charcoal/10"
            >
              <span className="block h-px w-10 bg-brand-copper mt-2" />
              <div className="space-y-2">
                <h3 className="font-serif text-xl text-brand-charcoal">
                  {item.title}
                </h3>
                <p className="text-brand-steel leading-relaxed max-w-2xl">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ====== 流程 ====== */}
      <section className="bg-brand-light">
        <div className="container-page py-20 md:py-24">
          <div className="max-w-xl mb-12 space-y-3">
            <span className="font-serif italic text-brand-copper text-sm">
              How it works
            </span>
            <h2 className="font-serif text-3xl text-brand-charcoal leading-tight">
              From brief to fulfillment
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { step: "01", title: "Brief us", desc: "Share your specs, target price, and volume." },
              { step: "02", title: "We source", desc: "We present stones and settings that fit your brief." },
              { step: "03", title: "You approve", desc: "Photos and videos for approval before production." },
              { step: "04", title: "We fulfill", desc: "Setting, packaging, and direct shipping under your brand." },
            ].map((item) => (
              <div key={item.step} className="space-y-3">
                <span className="font-serif text-sm text-brand-copper">
                  {item.step}
                </span>
                <h3 className="font-serif text-lg text-brand-charcoal">
                  {item.title}
                </h3>
                <p className="text-sm text-brand-steel leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CTA ====== */}
      <section className="container-page py-20 md:py-24 text-center">
        <div className="space-y-7">
          <h2 className="font-serif text-3xl md:text-4xl text-brand-charcoal">
            Start your own line
          </h2>
          <p className="text-brand-steel max-w-md mx-auto leading-relaxed">
            From a single SKU to a full collection — we&apos;ll build a
            white-label program around your brand.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-10 py-3.5 text-sm font-medium bg-brand-charcoal text-white rounded-sm hover:bg-brand-copper transition-colors tracking-wide"
          >
            Request a Quote
          </Link>
        </div>
      </section>
    </div>
  );
}
