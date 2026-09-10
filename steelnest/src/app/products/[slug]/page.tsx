import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getProductBySlug,
  getFeaturedProducts,
  getAllProducts,
} from "@/data/products";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import { ProductJsonLd } from "@/lib/structured-data";
import { absoluteUrl } from "@/lib/site";

// 每次请求都读取最新 products.json，保证后台编辑后前台立即生效
export const dynamic = "force-dynamic";

// ====== 告诉 Next.js 哪些页面需要预生成 ======
export async function generateStaticParams() {
  return (await getAllProducts()).map((p) => ({ slug: p.slug }));
}

// ====== 动态 SEO 标题 ======
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Not Found" };
  return {
    title: product.name,
    description: product.tagline,
    openGraph: {
      title: product.name,
      description: product.tagline,
      images: [{ url: absoluteUrl(product.images[0]), width: 400, height: 400 }],
      type: "website",
    },
  };
}

// ====== 钻石详情页面 ======
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = (await getFeaturedProducts()).filter(
    (p) => p.slug !== product.slug
  );

  const specLabels: Record<string, string> = {
    shape: "Shape",
    carat: "Carat",
    color: "Color",
    clarity: "Clarity",
    cut: "Cut",
    certificate: "Certificate",
    polish: "Polish",
    symmetry: "Symmetry",
    fluorescence: "Fluorescence",
  };

  return (
    <div className="bg-brand-cream">
      {/* Google 结构化数据（搜索结果富文本展示） */}
      <ProductJsonLd product={product} />

      <div className="container-page py-10 md:py-14">
        {/* ====== 面包屑导航 ====== */}
        <nav className="flex items-center gap-2 text-sm text-brand-steel mb-10">
          <Link href="/" className="hover:text-brand-copper transition-colors">
            Home
          </Link>
          <span className="text-brand-charcoal/30">/</span>
          <Link
            href="/shop"
            className="hover:text-brand-copper transition-colors"
          >
            Inventory
          </Link>
          <span className="text-brand-charcoal/30">/</span>
          <span className="text-brand-charcoal truncate">{product.name}</span>
        </nav>

        {/* ====== 产品主体：左图右文 ====== */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          {/* ---- 左：产品图片画廊 ---- */}
          <ProductGallery
            images={product.images}
            name={product.name}
            discount={product.discount}
          />

          {/* ---- 右：产品信息 ---- */}
          <div className="space-y-7">
            {/* 切型标签 */}
            <span className="font-serif italic text-brand-copper text-sm capitalize">
              {product.category}
            </span>

            {/* 产品名称 */}
            <h1 className="font-serif text-3xl md:text-4xl text-brand-charcoal leading-tight">
              {product.name}
            </h1>

            {/* 简短描述 */}
            <p className="text-brand-steel leading-relaxed">
              {product.tagline}
            </p>

            {/* 指示价 */}
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-3xl text-brand-charcoal">
                ${product.price.toLocaleString()}
              </span>
              <span className="text-sm text-brand-steel">
                indicative price — final quote on request
              </span>
            </div>

            {/* 询价按钮 */}
            <Link
              href={`/contact?product=${encodeURIComponent(product.slug)}`}
              className="inline-flex w-full md:w-auto items-center justify-center px-10 py-3.5 text-sm font-medium bg-brand-charcoal text-white rounded-sm hover:bg-brand-copper transition-colors tracking-wide"
            >
              Request a Quote
            </Link>

            {/* 卖点摘要 */}
            <ul className="space-y-3 border-t border-brand-charcoal/10 pt-7">
              {product.features.map((feat, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-brand-steel"
                >
                  <span className="text-brand-copper mt-0.5">—</span>
                  {feat}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ====== 规格参数表 ====== */}
        <section className="mt-20">
          <h2 className="font-serif text-2xl text-brand-charcoal mb-8">
            Diamond specifications
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-brand-charcoal/10 border border-brand-charcoal/10">
            {Object.entries(product.specs)
              .filter(([, v]) => v)
              .map(([key, value]) => (
                <div key={key} className="bg-brand-cream p-6 space-y-1.5">
                  <span className="text-xs text-brand-steel">
                    {specLabels[key] || key}
                  </span>
                  <p className="font-serif text-base text-brand-charcoal">
                    {value}
                  </p>
                </div>
              ))}
          </div>
        </section>

        {/* ====== 长描述 ====== */}
        <section className="mt-16 max-w-3xl">
          <h2 className="font-serif text-2xl text-brand-charcoal mb-5">
            About this stone
          </h2>
          <p className="text-brand-steel leading-relaxed text-lg">
            {product.description}
          </p>
        </section>

        {/* ====== 你可能也喜欢 ====== */}
        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <h2 className="font-serif text-2xl text-brand-charcoal mb-8">
              More from our inventory
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
