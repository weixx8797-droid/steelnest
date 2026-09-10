import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Transparency Hub",
  description:
    "LabOrigin transparency hub — 4C education, CVD vs HPHT, and our quality audit standard for lab-grown diamonds.",
};

export default function TransparencyPage() {
  return (
    <div className="bg-brand-cream">
      {/* ====== Hero ====== */}
      <section className="bg-brand-charcoal text-white">
        <div className="container-page py-20 md:py-28">
          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-brand-copper" />
            <span className="font-serif italic text-brand-copper/90 text-sm tracking-wide">
              Transparency hub
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl leading-[1.1] mt-6">
            No hidden stories,
            <br />
            <span className="text-gold">just real stones.</span>
          </h1>
          <p className="text-white/60 max-w-2xl mt-6 leading-relaxed">
            Remote sourcing only works on trust. That&apos;s why we document
            everything — grading, origin, and the exact condition of every stone
            before it ships.
          </p>
        </div>
      </section>

      {/* ====== 4C 科普 ====== */}
      <section className="container-page py-20 md:py-24">
        <div className="max-w-xl mb-12 space-y-3">
          <span className="font-serif italic text-brand-copper text-sm">
            Education
          </span>
          <h2 className="font-serif text-3xl text-brand-charcoal leading-tight">
            Understanding the 4Cs
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-brand-charcoal/10 border border-brand-charcoal/10">
          {[
            { c: "Carat", title: "Carat Weight", desc: "The weight of the stone. We source from melee up to 5ct+ in every shape." },
            { c: "Color", title: "Color", desc: "Graded D (colorless) to J. Colorless D–F is our most-requested range." },
            { c: "Clarity", title: "Clarity", desc: "From Flawless to Included. VVS1–VS2 is the sweet spot for value." },
            { c: "Cut", title: "Cut", desc: "Ideal / Excellent cut maximizes fire and brilliance. Never compromise on cut." },
          ].map((item) => (
            <div key={item.c} className="bg-brand-cream p-8 space-y-3">
              <span className="font-serif text-2xl text-brand-copper">
                {item.c}
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
      </section>

      {/* ====== CVD vs HPHT ====== */}
      <section className="bg-brand-light">
        <div className="container-page py-20 md:py-24">
          <div className="max-w-xl mb-12 space-y-3">
            <span className="font-serif italic text-brand-copper text-sm">
              The two methods
            </span>
            <h2 className="font-serif text-3xl text-brand-charcoal leading-tight">
              CVD vs HPHT — what you need to know
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-brand-cream rounded-sm p-9 space-y-4 border border-brand-charcoal/10">
              <h3 className="font-serif text-xl text-brand-charcoal">HPHT</h3>
              <p className="text-sm text-brand-steel leading-relaxed">
                High Pressure High Temperature replicates the earth&apos;s
                natural diamond-forming conditions. Henan dominates global HPHT
                production. Typically favored for smaller, colorless, and
                fancy-color stones.
              </p>
            </div>
            <div className="bg-brand-cream rounded-sm p-9 space-y-4 border border-brand-charcoal/10">
              <h3 className="font-serif text-xl text-brand-charcoal">CVD</h3>
              <p className="text-sm text-brand-steel leading-relaxed">
                Chemical Vapor Deposition grows diamond layer by layer from a
                carbon-rich gas. Typically favored for larger carat weights.
                Both methods produce genuine, certified diamonds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====== 质检标准 ====== */}
      <section className="container-page py-20 md:py-24">
        <div className="max-w-xl mb-12 space-y-3">
          <span className="font-serif italic text-brand-copper text-sm">
            Our audit standard
          </span>
          <h2 className="font-serif text-3xl text-brand-charcoal leading-tight">
            Proof, not promises
          </h2>
        </div>
        <div className="space-y-4 max-w-2xl">
          {[
            "20x magnification inspection of girdle inscriptions and inclusions",
            "Fire and brilliance check under controlled lighting",
            "IGI / GIA certificate cross-checked against the physical stone",
            "Photo and video documentation for every stone before shipment",
          ].map((item) => (
            <div
              key={item}
              className="flex items-start gap-4 py-4 border-b border-brand-charcoal/10"
            >
              <span className="text-brand-copper mt-0.5">—</span>
              <p className="text-sm text-brand-steel leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-brand-steel leading-relaxed mt-8 max-w-2xl">
          Your buyer can verify every IGI or GIA certificate online — because a
          certificate you can&apos;t check is worthless.
        </p>
      </section>

      {/* ====== CTA ====== */}
      <section className="container-page pb-20 md:pb-24 text-center">
        <div className="space-y-7">
          <h2 className="font-serif text-3xl md:text-4xl text-brand-charcoal">
            Get proof, not promises
          </h2>
          <p className="text-brand-steel max-w-md mx-auto leading-relaxed">
            Ask us for the inspection video and certificate on any stone in our
            inventory.
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
