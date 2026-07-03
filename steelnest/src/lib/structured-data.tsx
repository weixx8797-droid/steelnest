import type { Product } from "@/data/products";

/**
 * 产品结构化数据（JSON-LD）
 * Google 用这个在搜索结果中显示产品价格、评分、库存等富文本信息
 */
export function ProductJsonLd({ product }: { product: Product }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.tagline,
    image: product.images[0],
    sku: product.slug,
    brand: {
      "@type": "Brand",
      name: "SteelNest",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.price.toFixed(2),
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      ...(product.originalPrice && {
        priceValidUntil: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString().split("T")[0],
      }),
    },
    ...(product.specs && {
      additionalProperty: Object.entries(product.specs)
        .filter(([, v]) => v)
        .map(([key, value]) => ({
          "@type": "PropertyValue",
          name: key.replace(/([A-Z])/g, " $1").trim(),
          value: value,
        })),
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/**
 * 网站级结构化数据（Organization）
 */
export function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SteelNest",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/logo-icon.svg`,
    description:
      "Premium recyclable steel home organization products, factory-direct from Luoyang, China.",
    contactPoint: {
      "@type": "ContactPoint",
      email: "hello@steelnest.com",
      contactType: "customer service",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
