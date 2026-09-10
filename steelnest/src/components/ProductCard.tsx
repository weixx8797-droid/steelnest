import Link from "next/link";
import type { Product } from "@/data/products";

const SHAPE_LABELS: Record<string, string> = {
  round: "Round",
  princess: "Princess",
  oval: "Oval",
  emerald: "Emerald",
  cushion: "Cushion",
  pear: "Pear",
  marquise: "Marquise",
  radiant: "Radiant",
};

export default function ProductCard({ product }: { product: Product }) {
  const shapeLabel = SHAPE_LABELS[product.category] || product.category;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block bg-brand-cream rounded-sm border border-brand-charcoal/10 hover:border-brand-copper/40 hover:shadow-[0_24px_50px_-32px_rgba(20,19,15,0.45)] transition-all duration-300 overflow-hidden"
    >
      {/* ---- 产品图片 ---- */}
      <div className="relative aspect-square bg-brand-light overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.images[0]}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
        />

        {product.discount && (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-[11px] tracking-wide bg-brand-copper text-white">
            {product.discount}
          </span>
        )}
      </div>

      {/* ---- 产品信息 ---- */}
      <div className="p-6 space-y-2.5">
        <span className="text-xs text-brand-steel">{shapeLabel}</span>

        <h3 className="font-serif text-lg text-brand-charcoal leading-snug group-hover:text-brand-copper transition-colors">
          {product.name}
        </h3>

        <p className="text-sm text-brand-steel line-clamp-2 leading-relaxed">
          {product.tagline}
        </p>

        <div className="flex items-baseline gap-2 pt-1.5">
          <span className="font-serif text-xl text-brand-charcoal">
            ${product.price.toLocaleString()}
          </span>
          <span className="text-xs text-brand-steel">indicative</span>
        </div>

        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-copper group-hover:gap-3 transition-all duration-300">
          View &amp; quote
          <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  );
}
