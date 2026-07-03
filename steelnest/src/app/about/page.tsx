import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "SteelNest: Premium recyclable steel home organization, factory-direct from Luoyang's premier steel furniture industrial hub.",
};

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* ====== Hero ====== */}
      <section className="bg-brand-charcoal text-white">
        <div className="container-page py-16 md:py-20">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            Steel Over Wood.
            <br />
            <span className="text-brand-copper">That&apos;s Our Promise.</span>
          </h1>
        </div>
      </section>

      {/* ====== 品牌故事 ====== */}
      <section className="container-page py-16 md:py-20">
        <div className="max-w-3xl space-y-12">
          {/* Our Story */}
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-brand-charcoal">
              Our Story
            </h2>
            <p className="text-brand-steel leading-relaxed">
              SteelNest was born in Luoyang&apos;s Pangcun Town — a place known
              as China&apos;s capital of steel furniture manufacturing. For
              decades, the factories here have produced world-class steel
              products. But we saw an opportunity: to bring this craftsmanship
              directly to homes around the world, with a mission that matters.
            </p>
            <p className="text-brand-steel leading-relaxed">
              Every year, millions of trees are cut down to make wooden
              furniture and organizers — much of it discarded within a few
              years. We asked: what if we could replace wood with steel?
              Steel is stronger, lasts longer, and at the end of its life, it
              is 100% recyclable. No trees. No landfill. Just a better way to
              organize your home.
            </p>
          </div>

          {/* Factory Direct */}
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-brand-charcoal">
              Factory Direct. No Middlemen.
            </h2>
            <p className="text-brand-steel leading-relaxed">
              Unlike traditional retail, SteelNest products come straight from
              certified eco-conscious factories in Luoyang to your doorstep.
              No distributors. No markups. No warehouses full of plastic
              packaging. Just honest pricing for products built to last.
            </p>
            <p className="text-brand-steel leading-relaxed">
              We personally visit every factory we partner with. Each is
              certified by the Henan Provincial Department of Commerce for
              cross-border e-commerce, ensuring quality standards and ethical
              production. You get premium steel goods at prices that reflect
              what they actually cost to make.
            </p>
          </div>

          {/* Sustainability */}
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-brand-charcoal">
              Our Commitment to the Planet
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                {
                  icon: "♻️",
                  title: "100% Recyclable",
                  desc: "Every SteelNest product is made from recyclable cold-rolled steel. When its journey ends, it returns to the earth — not a landfill.",
                },
                {
                  icon: "🌳",
                  title: "Steel Over Wood",
                  desc: "Every steel shelf replaces wood that would come from trees. We estimate each product saves 0.3–2 trees over its lifetime.",
                },
                {
                  icon: "📦",
                  title: "Minimal Packaging",
                  desc: "We use recycled cardboard and zero plastic in our packaging. Flat-pack designs reduce shipping volume and carbon footprint.",
                },
              ].map((item) => (
                <div key={item.title} className="bg-brand-light rounded-xl p-6 space-y-2">
                  <span className="text-2xl">{item.icon}</span>
                  <h3 className="text-sm font-bold text-brand-charcoal">
                    {item.title}
                  </h3>
                  <p className="text-xs text-brand-steel leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-brand-charcoal rounded-xl p-8 text-center text-white space-y-4">
            <h3 className="text-xl font-bold">Ready to Make the Switch?</h3>
            <p className="text-gray-400 max-w-md mx-auto text-sm">
              Join thousands of homes choosing durable, recyclable steel over
              disposable wood.
            </p>
            <Link
              href="/shop"
              className="inline-flex px-6 py-3 bg-brand-copper text-white text-sm font-semibold rounded-md hover:bg-[#B8953E] transition-colors"
            >
              Shop Our Collection
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
