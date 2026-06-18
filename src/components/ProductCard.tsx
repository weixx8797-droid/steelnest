import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-brand-copper/30 hover:shadow-lg transition-all duration-300"
    >
      {/* ---- 产品图片 ---- */}
      <div className="relative aspect-square bg-brand-light overflow-hidden">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* 折扣/新品标签 */}
        {product.discount && (
          <span
            className={`absolute top-3 left-3 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded ${
              product.discount === "NEW"
                ? "bg-brand-leaf text-white"
                : "bg-brand-copper text-white"
            }`}
          >
            {product.discount}
          </span>
        )}
      </div>

      {/* ---- 产品信息 ---- */}
      <div className="p-5 space-y-2">
        {/* 分类 */}
        <span className="text-[11px] font-medium text-brand-steel uppercase tracking-widest">
          {product.category === "desk"
            ? "Desk & Counter"
            : product.category === "bathroom"
              ? "Bathroom"
              : "Storage"}
        </span>

        {/* 名称 */}
        <h3 className="text-base font-semibold text-brand-charcoal line-clamp-2 leading-snug group-hover:text-brand-copper transition-colors">
          {product.name}
        </h3>

        {/* 简短描述 */}
        <p className="text-xs text-brand-steel line-clamp-2 leading-relaxed">
          {product.tagline}
        </p>

        {/* 价格 */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-lg font-bold text-brand-charcoal">
            ${product.price}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>

        {/* 颜色选项（小圆点） */}
        <div className="flex items-center gap-1.5 pt-1">
          {product.colors.map((color) => (
            <span
              key={color.name}
              className="w-4 h-4 rounded-full border border-gray-200"
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
          <span className="text-[11px] text-brand-steel ml-1">
            {product.colors.length} color{product.colors.length > 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </Link>
  );
}
