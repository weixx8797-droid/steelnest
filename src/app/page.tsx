import Link from "next/link";
import { getFeaturedProducts } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  const featuredProducts = getFeaturedProducts();
  return (
    <>
      {/* ========== Hero 主视觉区 ========== */}
      <section className="relative bg-gradient-to-br from-brand-charcoal via-[#1a1f20] to-brand-charcoal text-white overflow-hidden">
        <div className="container-page py-20 md:py-32 lg:py-40">
          <div className="max-w-2xl space-y-6">
            {/* 环保标签 */}
            <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-widest uppercase bg-brand-leaf/20 text-brand-leaf border border-brand-leaf/30 rounded-full">
              🌿 Eco-Friendly
            </span>

            {/* 主标题 */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              Steel Over Wood.
              <br />
              <span className="text-brand-copper">Stronger Homes,</span>
              <br />
              Fewer Trees.
            </h1>

            {/* 副标题 */}
            <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-lg">
              Premium recyclable steel storage — from Luoyang&apos;s finest
              factories to your doorstep. Durable, sustainable, designed to
              last.
            </p>

            {/* CTA 按钮组 */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-semibold bg-brand-copper text-white rounded-md hover:bg-[#B8953E] transition-colors tracking-wide"
              >
                Shop Collection
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-semibold border border-white/20 text-white rounded-md hover:bg-white/10 transition-colors tracking-wide"
              >
                Our Story
              </Link>
            </div>
          </div>
        </div>

        {/* 底部装饰斜线 */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-brand-cream to-transparent" />
      </section>

      {/* ========== 卖点条 ========== */}
      <section className="border-b border-gray-100 bg-white">
        <div className="container-page py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              {
                icon: "♻️",
                title: "100% Recyclable",
                desc: "Steel that returns to earth",
              },
              {
                icon: "🏭",
                title: "Factory Direct",
                desc: "No middlemen, better value",
              },
              {
                icon: "📦",
                title: "Free Over $49",
                desc: "Fast worldwide shipping",
              },
              {
                icon: "🛡️",
                title: "5 Year Warranty",
                desc: "Built to outlast wood",
              },
            ].map((item) => (
              <div key={item.title} className="space-y-2">
                <span className="text-2xl">{item.icon}</span>
                <h3 className="text-sm font-semibold text-brand-charcoal">
                  {item.title}
                </h3>
                <p className="text-xs text-brand-steel">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== 产品分类导览 ========== */}
      <section className="container-page py-16 md:py-20">
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-charcoal">
            Explore Our Collection
          </h2>
          <p className="text-brand-steel max-w-lg mx-auto">
            Thoughtfully designed steel organizers for every corner of your home
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Storage Racks",
              desc: "Modular shelving for kitchen, garage, and beyond",
              href: "/shop?category=storage",
              color: "from-amber-100 to-orange-50",
              emoji: "📚",
            },
            {
              title: "Desk Organizers",
              desc: "Clean up your workspace with steel elegance",
              href: "/shop?category=desk",
              color: "from-gray-100 to-stone-50",
              emoji: "🖥️",
            },
            {
              title: "Bathroom Accessories",
              desc: "Rust-proof steel for damp environments",
              href: "/shop?category=bathroom",
              color: "from-blue-50 to-slate-50",
              emoji: "🛁",
            },
          ].map((cat) => (
            <Link
              key={cat.title}
              href={cat.href}
              className={`group relative bg-gradient-to-br ${cat.color} rounded-xl p-8 hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-brand-copper/30`}
            >
              <span className="text-4xl mb-4 block">{cat.emoji}</span>
              <h3 className="text-lg font-semibold text-brand-charcoal group-hover:text-brand-copper transition-colors">
                {cat.title}
              </h3>
              <p className="text-sm text-brand-steel mt-2">{cat.desc}</p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-copper mt-4 group-hover:gap-2 transition-all">
                Shop Now →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ========== 精选产品 ========== */}
      <section className="container-page py-16 md:py-20">
        <div className="flex items-center justify-between mb-10">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-charcoal">
              Featured Products
            </h2>
            <p className="text-brand-steel">
              Our most-loved steel organizers, factory-direct from Luoyang
            </p>
          </div>
          <Link
            href="/shop"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-brand-copper hover:text-[#B8953E] transition-colors"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>

        <div className="text-center mt-8 sm:hidden">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-copper hover:text-[#B8953E] transition-colors"
          >
            View All Products →
          </Link>
        </div>
      </section>

      {/* ========== 品牌故事片段 ========== */}
      <section className="bg-white py-16 md:py-20">
        <div className="container-page">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* 左侧文字 */}
            <div className="space-y-6">
              <span className="text-xs font-semibold tracking-widest uppercase text-brand-copper">
                Our Mission
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-charcoal leading-tight">
                From Luoyang&apos;s Finest Factories to Your Home
              </h2>
              <p className="text-brand-steel leading-relaxed">
                Nestled in Luoyang&apos;s Pangcun Town — China&apos;s premier
                steel furniture industrial hub — we partner directly with
                certified eco-conscious factories. Every SteelNest product is
                made from recyclable steel, eliminating the need for timber
                while delivering unmatched durability.
              </p>
              <p className="text-brand-steel leading-relaxed">
                No middlemen. No markups. Just honest, factory-direct
                craftsmanship shipped straight to your door.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-copper hover:text-[#B8953E] transition-colors"
              >
                Read Our Full Story →
              </Link>
            </div>

            {/* 右侧图片占位（先用品牌色块代替，你有实拍图后替换） */}
            <div className="aspect-[4/3] bg-gradient-to-br from-brand-light to-brand-steel/10 rounded-xl flex items-center justify-center">
              <div className="text-center space-y-2">
                <span className="text-5xl">🏭</span>
                <p className="text-sm text-brand-steel">
                  Luoyang Pangcun Factory
                  <br />
                  Your photo here
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 底部 CTA ========== */}
      <section className="container-page py-16 md:py-20 text-center">
        <div className="bg-brand-charcoal rounded-2xl px-8 py-14 md:py-16 text-white space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Make the Switch?
          </h2>
          <p className="text-gray-400 max-w-md mx-auto">
            Join thousands of homes choosing steel over wood. Free shipping on
            orders over $49.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center px-8 py-3.5 text-sm font-semibold bg-brand-copper text-white rounded-md hover:bg-[#B8953E] transition-colors tracking-wide"
          >
            Browse All Products
          </Link>
        </div>
      </section>
    </>
  );
}
