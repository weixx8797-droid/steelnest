import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "LabOrigin — a lab-grown diamond source agent and quality auditor based in Henan, China, connecting overseas jewelers to factory-direct supply.",
};

export default function AboutPage() {
  return (
    <div className="bg-brand-cream">
      {/* ====== Hero ====== */}
      <section className="bg-brand-charcoal text-white">
        <div className="container-page py-20 md:py-28">
          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-brand-copper" />
            <span className="font-serif italic text-brand-copper/90 text-sm tracking-wide">
              About LabOrigin
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl leading-[1.1] mt-6">
            Your eyes in Henan.
            <br />
            <span className="text-gold">That&apos;s our role.</span>
          </h1>
        </div>
      </section>

      {/* ====== 品牌故事 ====== */}
      <section className="container-page py-20 md:py-24">
        <div className="max-w-3xl space-y-16">
          <div className="space-y-5">
            <span className="font-serif italic text-brand-copper text-sm">
              Our story
            </span>
            <h2 className="font-serif text-3xl text-brand-charcoal leading-tight">
              Minutes from the factories of Henan
            </h2>
            <p className="text-brand-steel leading-relaxed">
              Henan is the undisputed center of the global lab-grown diamond
              industry — the vast majority of the world&apos;s HPHT stones come
              from this region. LabOrigin was founded here, minutes from the
              factories of Zhengzhou, Nanyang, and Shangqiu.
            </p>
            <p className="text-brand-steel leading-relaxed">
              Overseas jewelers and brands don&apos;t need another middleman.
              They need someone on the ground who can walk into a factory,
              inspect a stone under 20x magnification, and tell them exactly
              what they&apos;re buying. That&apos;s what we do.
            </p>
          </div>

          <div className="space-y-5">
            <span className="font-serif italic text-brand-copper text-sm">
              Source agent &amp; quality auditor
            </span>
            <h2 className="font-serif text-3xl text-brand-charcoal leading-tight">
              We don&apos;t manufacture — we audit
            </h2>
            <p className="text-brand-steel leading-relaxed">
              We bridge the information gap between Henan&apos;s factories and
              overseas buyers. We source stones to your exact specs, verify
              every IGI / GIA certificate against the physical stone, and
              document condition with photo and video before anything ships.
            </p>
            <p className="text-brand-steel leading-relaxed">
              You get factory-direct pricing, verified quality, and a partner
              who&apos;s accountable for every stone — not a faceless listing.
            </p>
          </div>

          <div className="space-y-8">
            <span className="font-serif italic text-brand-copper text-sm">
              What we promise
            </span>
            <div className="grid sm:grid-cols-3 gap-px bg-brand-charcoal/10 border border-brand-charcoal/10">
              {[
                {
                  title: "Factory Direct",
                  desc: "Real source relationships with vetted HPHT & CVD producers — no layers of markup.",
                },
                {
                  title: "Verified Quality",
                  desc: "Every stone inspected against its certificate before shipment, documented for you.",
                },
                {
                  title: "Accountable",
                  desc: "One point of contact who stands behind every order, from melee to 5ct+.",
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
          </div>

          {/* CTA */}
          <div className="bg-brand-charcoal rounded-sm p-10 text-center text-white space-y-5">
            <h3 className="font-serif text-2xl">Start sourcing with us</h3>
            <p className="text-white/60 max-w-md mx-auto text-sm leading-relaxed">
              Tell us what you need. We&apos;ll respond with pricing, lead
              times, and available stock.
            </p>
            <Link
              href="/contact"
              className="inline-flex px-8 py-3 bg-brand-copper text-white text-sm font-medium rounded-sm hover:bg-[#a9834a] transition-colors"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
