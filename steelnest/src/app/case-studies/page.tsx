import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Engagement Models",
  description:
    "How overseas jewelry designers and brands work with LabOrigin — repeat sourcing programs, white-label collections, and scheduled melee supply from Henan, China.",
};

export default function CaseStudiesPage() {
  return (
    <div className="bg-brand-cream">
      {/* ====== Hero ====== */}
      <section className="bg-brand-charcoal text-white">
        <div className="container-page py-20 md:py-28">
          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-brand-copper" />
            <span className="font-serif italic text-brand-copper/90 text-sm tracking-wide">
              Engagement models
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl leading-[1.1] mt-6">
            How brands work with us
            <br />
            <span className="text-gold">scale on lab-grown.</span>
          </h1>
          <p className="text-white/60 max-w-2xl mt-6 leading-relaxed">
            Three ways brands typically plug into a Henan-direct supply chain.
            Pick the one closest to your situation and we&apos;ll scope it
            around your specs, your market, and your margin.
          </p>
        </div>
      </section>

      {/* ====== 案例列表 ====== */}
      <section className="container-page py-20 md:py-24">
        <div className="space-y-6">
          {[
            {
              tag: "Repeat sourcing",
              title: "Build a repeatable loose-stone channel",
              metric: "Weekly stock sheets",
              desc: "For designers who need consistent 1–2ct colorless stones: fixed grading specs, weekly availability sheets, and video approval on each stone before it ships, so you can quote a job without holding inventory.",
            },
            {
              tag: "White label",
              title: "Launch a collection without holding stock",
              metric: "No inventory",
              desc: "For brands testing a lab-grown line: we source matched stones, produce the settings, and drop-ship finished pieces in your packaging, so you can validate demand before committing to a production run.",
            },
            {
              tag: "Program supply",
              title: "Lock in calibrated melee and matched pairs",
              metric: "Recurring batches",
              desc: "For wholesalers running on a schedule: we hold the supplier relationships and run the same QC tolerance on every batch, so a one-off order becomes a repeatable program.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="grid md:grid-cols-[1fr_auto] gap-8 items-start py-10 border-b border-brand-charcoal/10"
            >
              <div className="space-y-4">
                <span className="font-serif italic text-brand-copper text-sm">
                  {item.tag}
                </span>
                <h3 className="font-serif text-xl md:text-2xl text-brand-charcoal">
                  {item.title}
                </h3>
                <p className="text-brand-steel leading-relaxed">{item.desc}</p>
              </div>
              <div className="md:text-right">
                <span className="text-sm font-medium text-brand-copper whitespace-nowrap">
                  {item.metric}
                </span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-brand-steel leading-relaxed mt-10 max-w-2xl">
          Prefer to start small? Most partnerships begin with a single paid
          sample order before any volume commitment. Every stone in that order
          gets the same documentation we&apos;d run on a full production batch.
        </p>
      </section>

      {/* ====== CTA ====== */}
      <section className="container-page pb-20 md:pb-24 text-center">
        <div className="space-y-7">
          <h2 className="font-serif text-3xl md:text-4xl text-brand-charcoal">
            Your brand could be next
          </h2>
          <p className="text-brand-steel max-w-md mx-auto leading-relaxed">
            Tell us what you&apos;re trying to build. We&apos;ll show you how a
            Henan-direct supply chain gets you there.
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
