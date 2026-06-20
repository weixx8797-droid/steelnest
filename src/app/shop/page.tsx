import Link from "next/link";
import { getAllProducts } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export const metadata = {
  title: "Shop",
  description:
    "Browse our full collection of premium recyclable steel home organizers. Storage racks, desk organizers, bathroom accessories — all factory-direct from Luoyang.",
};

export default function ShopPage() {
  const products = getAllProducts();

  return (
    <div className="bg-brand-cream">
      {/* ====== 页面标题栏 ====== */}
      <section className="bg-white border-b border-gray-100">
        <div className="container-page py-12 md:py-16">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-charcoal">
            Shop All Products
          </h1>
          <p className="text-brand-steel mt-3 max-w-lg">
            Steel over wood. Every product is crafted from recyclable
            cold-rolled steel at our partner factories in Luoyang, China.
          </p>
        </div>
      </section>

      {/* ====== 分类快捷标签 ====== */}
      <section className="container-page py-8">
        <div className="flex flex-wrap gap-3">
          {[
            { label: "All", href: "/shop" },
            { label: "Storage Racks", href: "/shop?category=storage" },
            { label: "Desk & Counter", href: "/shop?category=desk" },
            {
              label: "Bathroom Accessories",
              href: "/shop?category=bathroom",
            },
          ].map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-full hover:border-brand-copper hover:text-brand-copper transition-colors"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </section>

      {/* ====== 产品网格 ====== */}
      <section className="container-page pb-20">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-brand-steel text-lg">
              No products found in this category.
            </p>
            <Link
              href="/shop"
              className="inline-block mt-4 text-brand-copper hover:underline"
            >
              View all products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
