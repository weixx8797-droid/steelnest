import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Source Capability",
  description:
    "LabOrigin source capability — lab-grown diamonds direct from Henan, China, the world's hub of HPHT & CVD production.",
};

export default function CapabilitiesPage() {
  return (
    <div className="bg-brand-cream">
      {/* ====== Hero ====== */}
      <section className="bg-brand-charcoal text-white">
        <div className="container-page py-20 md:py-28">
          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-brand-copper" />
            <span className="font-serif italic text-brand-copper/90 text-sm tracking-wide">
              Source capability
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl leading-[1.1] mt-6">
            Direct from the world&apos;s hub
            <br />
            <span className="text-gold">— Henan, China.</span>
          </h1>
          <p className="text-white/60 max-w-2xl mt-6 leading-relaxed">
            Henan produces the majority of the world&apos;s lab-grown diamonds
            through HPHT and CVD. LabOrigin sits at the center of that
            production — giving you factory-direct access without the
            middlemen.
          </p>
        </div>
      </section>

      {/* ====== 能力概览 ====== */}
      <section className="container-page py-20 md:py-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-brand-charcoal/10 border border-brand-charcoal/10">
          {[
            {
              title: "Factory Network",
              desc: "Vetted HPHT & CVD producers across Zhengzhou, Nanyang and Shangqiu.",
            },
            {
              title: "Scalable Output",
              desc: "From single loose stones to monthly bulk programs.",
            },
            {
              title: "Quality Audited",
              desc: "Every stone inspected against IGI / GIA grading standards.",
            },
            {
              title: "Live Stock Sheets",
              desc: "Real-time inventory with video links, updated weekly.",
            },
          ].map((item) => (
            <div key={item.title} className="bg-brand-cream p-8 space-y-3">
              <span className="block h-px w-8 bg-brand-copper" />
              <h3 className="font-serif text-lg text-brand-charcoal">
                {item.title}
              </h3>
              <p className="text-sm text-brand-steel leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ====== 产能与工艺 ====== */}
      <section className="bg-brand-light">
        <div className="container-page py-20 md:py-24 grid md:grid-cols-2 gap-16">
          <div className="space-y-7">
            <span className="font-serif italic text-brand-copper text-sm">
              Production methods
            </span>
            <h2 className="font-serif text-3xl text-brand-charcoal leading-tight">
              HPHT &amp; CVD — two paths, one standard
            </h2>
            <p className="text-brand-steel leading-relaxed">
              We source both High Pressure High Temperature (HPHT) and Chemical
              Vapor Deposition (CVD) stones. We match the right growth method to
              your application — colorless rounds, fancy colors, melee, or
              larger carat weights — and verify every stone&apos;s origin,
              color, and clarity before it leaves our hands.
            </p>
            <ul className="space-y-3">
              {[
                "Colorless D–F and near-colorless G–J",
                "Fancy colors: pink, blue, yellow",
                "Carat weights from melee to 5ct+",
                "All shapes: round, oval, emerald, cushion, princess, pear, marquise, radiant",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm text-brand-steel"
                >
                  <span className="text-brand-copper mt-0.5">—</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-brand-charcoal rounded-sm p-9 text-white space-y-6 self-start">
            <h3 className="font-serif text-xl">What we supply</h3>
            {[
              { label: "Loose diamonds", value: "Certified, graded, ready to ship" },
              { label: "Parall / calibrated melee", value: "For pavé and micro-setting" },
              { label: "Finished jewelry", value: "Via partner setting factories" },
              { label: "White-label programs", value: "Drop-shipped under your brand" },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between gap-4 border-b border-white/10 pb-3 last:border-0 last:pb-0"
              >
                <span className="text-sm font-medium">{row.label}</span>
                <span className="text-sm text-white/50 text-right">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CTA ====== */}
      <section className="container-page py-20 md:py-24 text-center">
        <div className="space-y-7">
          <h2 className="font-serif text-3xl md:text-4xl text-brand-charcoal">
            Need a supply partner?
          </h2>
          <p className="text-brand-steel max-w-md mx-auto leading-relaxed">
            Tell us your specs, quantities, and target market. We&apos;ll
            respond with pricing, lead times, and available stock.
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
