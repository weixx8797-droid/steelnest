import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProductBySlug, getFeaturedProducts } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import AddToCartButton from "@/components/AddToCartButton";
import { ProductJsonLd } from "@/lib/structured-data";

// ====== 告诉 Next.js 哪些页面需要预生成 ======
export async function generateStaticParams() {
  const { products } = await import("@/data/products");
  return products.map((p) => ({ slug: p.slug }));
}

// ====== 动态 SEO 标题 ======
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Not Found" };
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    title: product.name,
    description: product.tagline,
    openGraph: {
      title: product.name,
      description: product.tagline,
      images: [{ url: `${siteUrl}${product.images[0]}`, width: 400, height: 400 }],
      type: "website",
    },
  };
}

// ====== 产品详情页面 ======
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = getFeaturedProducts().filter(
    (p) => p.slug !== product.slug
  );

  return (
    <div className="bg-white">
      {/* Google 结构化数据（搜索结果富文本展示） */}
      <ProductJsonLd product={product} />

      <div className="container-page py-8 md:py-12">
        {/* ====== 面包屑导航 ====== */}
        <nav className="flex items-center gap-2 text-sm text-brand-steel mb-8">
          <Link href="/" className="hover:text-brand-copper transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href="/shop"
            className="hover:text-brand-copper transition-colors"
          >
            Shop
          </Link>
          <span>/</span>
          <span className="text-brand-charcoal truncate">{product.name}</span>
        </nav>

        {/* ====== 产品主体：左图右文 ====== */}
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          {/* ---- 左：图片轮播（简化版，展示两张图） ---- */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-brand-light rounded-xl overflow-hidden">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              {product.discount && (
                <span
                  className={`absolute top-4 left-4 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded ${
                    product.discount === "NEW"
                      ? "bg-brand-leaf text-white"
                      : "bg-brand-copper text-white"
                  }`}
                >
                  {product.discount}
                </span>
              )}
            </div>
            {/* 缩略图列表 */}
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <div
                  key={i}
                  className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-brand-copper cursor-pointer transition-colors"
                >
                  <Image
                    src={img}
                    alt={`${product.name} view ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ---- 右：产品信息 ---- */}
          <div className="space-y-6">
            {/* 分类标签 */}
            <span className="text-xs font-medium text-brand-copper uppercase tracking-widest">
              {product.category === "desk"
                ? "Desk & Counter"
                : product.category === "bathroom"
                  ? "Bathroom"
                  : "Storage"}
            </span>

            {/* 产品名称 */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-brand-charcoal leading-tight">
              {product.name}
            </h1>

            {/* 简短描述 */}
            <p className="text-brand-steel leading-relaxed">
              {product.tagline}
            </p>

            {/* 价格 */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-brand-charcoal">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-gray-400 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>

            {/* 加购按钮（含颜色选择）*/}
            <AddToCartButton product={product} />

            {/* 卖点摘要 */}
            <ul className="space-y-2 border-t border-gray-100 pt-6">
              {product.features.map((feat, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-brand-steel"
                >
                  <span className="text-brand-leaf mt-0.5">✓</span>
                  {feat}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ====== 规格参数表 ====== */}
        <section className="mt-20">
          <h2 className="text-2xl font-bold text-brand-charcoal mb-6">
            Specifications
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(product.specs).map(([key, value]) => (
              <div
                key={key}
                className="bg-brand-light rounded-lg p-5 space-y-1"
              >
                <span className="text-xs text-brand-steel uppercase tracking-wider">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </span>
                <p className="text-sm font-semibold text-brand-charcoal">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ====== 长描述 ====== */}
        <section className="mt-16 max-w-3xl">
          <h2 className="text-2xl font-bold text-brand-charcoal mb-4">
            About This Product
          </h2>
          <p className="text-brand-steel leading-relaxed text-lg">
            {product.description}
          </p>
        </section>

        {/* ====== 你可能也喜欢 ====== */}
        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <h2 className="text-2xl font-bold text-brand-charcoal mb-6">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
