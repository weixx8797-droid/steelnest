import Link from "next/link";
import { getAllProducts } from "@/data/products";
import ProductCard from "@/components/ProductCard";

// 每次请求都读取最新 products.json，保证后台编辑后前台立即生效
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Live Inventory",
  description:
    "LabOrigin live inventory — certified lab-grown diamonds available now, direct from Henan, China. Request a quote on any stone.",
};

const SHAPES = [
  { label: "All", value: "" },
  { label: "Round", value: "round" },
  { label: "Princess", value: "princess" },
  { label: "Oval", value: "oval" },
  { label: "Emerald", value: "emerald" },
  { label: "Cushion", value: "cushion" },
  { label: "Pear", value: "pear" },
  { label: "Marquise", value: "marquise" },
  { label: "Radiant", value: "radiant" },
];

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const all = await getAllProducts();
  const products =
    category && category !== ""
      ? all.filter((p) => p.category === category)
      : all;

  return (
    <div className="bg-brand-cream">
      {/* ====== 页面标题栏 ====== */}
      <section className="bg-brand-charcoal text-white">
        <div className="container-page py-16 md:py-24">
          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-brand-copper" />
            <span className="font-serif italic text-brand-copper/90 text-sm tracking-wide">
              Available now
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl leading-[1.1] mt-5">
            Live inventory
          </h1>
          <p className="text-white/60 mt-5 max-w-lg leading-relaxed">
            Certified lab-grown diamonds available now — direct from Henan,
            China. Request a quote on any stone.
          </p>
        </div>
      </section>

      {/* ====== 切型快捷标签 ====== */}
      <section className="container-page py-10">
        <div className="flex flex-wrap gap-2.5">
          {SHAPES.map((shape) => (
            <Link
              key={shape.value}
              href={shape.value ? `/shop?category=${shape.value}` : "/shop"}
              className={`px-5 py-2 text-sm font-medium border rounded-sm transition-colors ${
                (category || "") === shape.value
                  ? "border-brand-copper text-brand-copper bg-brand-copper/5"
                  : "border-brand-charcoal/15 text-brand-steel hover:border-brand-copper hover:text-brand-copper"
              }`}
            >
              {shape.label}
            </Link>
          ))}
        </div>
      </section>

      {/* ====== 库存网格 ====== */}
      <section className="container-page pb-20">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-brand-steel text-lg">
              No stones found in this shape.
            </p>
            <Link
              href="/shop"
              className="inline-block mt-4 text-brand-copper hover:underline"
            >
              View all inventory
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
