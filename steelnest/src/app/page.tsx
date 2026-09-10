import Link from "next/link";
import { getFeaturedProducts } from "@/data/products";
import ProductCard from "@/components/ProductCard";

// 每次请求都读取最新 products.json，保证后台编辑后前台立即生效
export const dynamic = "force-dynamic";

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();
  return (
    <>
      {/* ========== Hero 主视觉区 ========== */}
      <section className="relative bg-brand-charcoal text-white overflow-hidden">
        {/* 柔和的香槟金光晕 */}
        <div className="absolute -top-48 -right-48 w-[640px] h-[640px] rounded-full bg-brand-copper/10 blur-3xl pointer-events-none" />
        <div className="container-page relative py-24 md:py-36 lg:py-44">
          <div className="max-w-2xl space-y-8">
            {/* 眉题：发丝线 + 衬线斜体 */}
            <div className="flex items-center gap-4">
              <span className="h-px w-12 bg-brand-copper" />
              <span className="font-serif italic text-brand-copper/90 text-sm tracking-wide">
                Direct from Henan, China
              </span>
            </div>

            {/* 主标题 */}
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight">
              Lab-grown diamonds,
              <br />
              <span className="text-gold">from the source.</span>
            </h1>

            {/* 副标题 */}
            <p className="text-base md:text-lg text-white/60 leading-relaxed max-w-xl">
              LabOrigin connects overseas jewelers and brands to Henan — the
              world&apos;s hub of HPHT &amp; CVD lab-grown diamond production.
              Certified, audited, and ready to scale.
            </p>

            {/* CTA 按钮组 */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center px-9 py-3.5 text-sm font-medium bg-brand-copper text-white rounded-sm hover:bg-[#a9834a] transition-colors tracking-wide"
              >
                View Live Inventory
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-9 py-3.5 text-sm font-medium border border-white/25 text-white rounded-sm hover:border-brand-copper hover:text-brand-copper transition-colors tracking-wide"
              >
                Request a Quote
              </Link>
            </div>
          </div>
        </div>

        {/* 底部金发丝线 */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-copper/50 to-transparent" />
      </section>

      {/* ========== 卖点条 ========== */}
      <section className="border-b border-brand-charcoal/10 bg-brand-cream">
        <div className="container-page py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-8">
            {[
              {
                title: "Source Direct",
                desc: "Henan factory-direct access",
              },
              {
                title: "IGI · GIA Certified",
                desc: "Every stone graded & verifiable",
              },
              {
                title: "Quality Audited",
                desc: "Inspected before it ships",
              },
              {
                title: "White-Label Ready",
                desc: "Dropship under your brand",
              },
            ].map((item) => (
              <div key={item.title} className="space-y-3">
                <span className="block h-px w-8 bg-brand-copper" />
                <h3 className="font-serif text-base text-brand-charcoal">
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

      {/* ========== 支柱导览 ========== */}
      <section className="container-page py-20 md:py-28">
        <div className="max-w-xl mb-14 space-y-4">
          <span className="font-serif italic text-brand-copper text-sm">
            What we offer
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-brand-charcoal leading-tight">
            Your supply-chain partner
          </h2>
          <p className="text-brand-steel leading-relaxed">
            Everything you need to build a lab-grown diamond business — from
            sourcing to fulfillment.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-brand-charcoal/10 border border-brand-charcoal/10">
          {[
            {
              title: "Source Capability",
              desc: "HPHT & CVD stones direct from Henan's production hub",
              href: "/capabilities",
            },
            {
              title: "White Label",
              desc: "Dropshipping, custom packaging, and setting services",
              href: "/white-label",
            },
            {
              title: "Transparency",
              desc: "4C education, CVD vs HPHT, and our audit standard",
              href: "/transparency",
            },
            {
              title: "Case Studies",
              desc: "How we help designers and brands scale",
              href: "/case-studies",
            },
          ].map((cat) => (
            <Link
              key={cat.title}
              href={cat.href}
              className="group bg-brand-cream p-8 flex flex-col justify-between min-h-[220px] hover:bg-brand-light transition-colors duration-300"
            >
              <div className="space-y-3">
                <span className="block h-px w-6 bg-brand-copper/50 group-hover:w-12 group-hover:bg-brand-copper transition-all duration-500" />
                <h3 className="font-serif text-lg text-brand-charcoal group-hover:text-brand-copper transition-colors">
                  {cat.title}
                </h3>
                <p className="text-sm text-brand-steel leading-relaxed">
                  {cat.desc}
                </p>
              </div>
              <span className="text-sm text-brand-copper opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Learn more
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ========== 精选库存 ========== */}
      <section className="container-page py-16 md:py-24">
        <div className="flex items-end justify-between mb-12">
          <div className="space-y-3">
            <span className="font-serif italic text-brand-copper text-sm">
              Available now
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-brand-charcoal leading-tight">
              Featured inventory
            </h2>
            <p className="text-brand-steel">
              Selected certified loose diamonds, ready to ship
            </p>
          </div>
          <Link
            href="/shop"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-brand-charcoal hover:text-brand-copper transition-colors"
          >
            View all
            <span aria-hidden className="text-brand-copper">
              →
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>

        <div className="text-center mt-10 sm:hidden">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-medium text-brand-copper"
          >
            View all inventory →
          </Link>
        </div>
      </section>

      {/* ========== 定位说明 ========== */}
      <section className="bg-brand-charcoal text-white">
        <div className="container-page py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-7">
              <div className="flex items-center gap-4">
                <span className="h-px w-12 bg-brand-copper" />
                <span className="font-serif italic text-brand-copper/90 text-sm">
                  Who we are
                </span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl leading-tight">
                Your eyes in Henan.
              </h2>
              <div className="space-y-4 text-white/60 leading-relaxed">
                <p>
                  LabOrigin is a source agent and quality auditor for lab-grown
                  diamonds. We don&apos;t ask you to trust a catalog — we run
                  the factories, inspect the stones, and verify every
                  certificate on your behalf.
                </p>
                <p>
                  No middlemen. No hidden grades. Just factory-direct stones,
                  documented and ready for your brand.
                </p>
              </div>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-medium text-brand-copper hover:text-brand-copper/80 transition-colors"
              >
                Read our story
                <span aria-hidden>→</span>
              </Link>
            </div>

            <div className="aspect-[4/3] bg-gradient-to-br from-white/5 to-transparent rounded-sm border border-white/10 flex items-center justify-center">
              <div className="text-center space-y-3">
                <span className="font-serif text-6xl text-brand-copper/60">
                  ◆
                </span>
                <p className="text-sm text-white/40 tracking-wide">
                  Henan lab-grown diamond production
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 底部 CTA ========== */}
      <section className="container-page py-20 md:py-28 text-center">
        <div className="space-y-7">
          <h2 className="font-serif text-3xl md:text-4xl text-brand-charcoal">
            Ready to source lab-grown?
          </h2>
          <p className="text-brand-steel max-w-md mx-auto leading-relaxed">
            Send us your specs and quantities. We&apos;ll respond with pricing,
            lead times, and available stock within 24 hours.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-10 py-3.5 text-sm font-medium bg-brand-charcoal text-white rounded-sm hover:bg-brand-copper transition-colors tracking-wide"
          >
            Request a Quote
          </Link>
        </div>
      </section>
    </>
  );
}
