import type { Product } from "@/data/products";
import { absoluteUrl, getSiteUrl } from "@/lib/site";

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
    image: absoluteUrl(product.images[0]),
    sku: product.slug,
    brand: {
      "@type": "Brand",
      name: "LabOrigin",
    },
    // B2B 询价制：没有公开价格，就不声明 offers。
    // Google 对带 offers 却不带 price 的 Product 会报“缺少 price”错误。
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
  const siteUrl = getSiteUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "LabOrigin",
    url: siteUrl,
    logo: `${siteUrl}/logo-icon.svg`,
    description:
      "Lab-grown diamond supply-chain portal — sourcing, quality auditing, and white-label manufacturing direct from Henan, China, the world's hub of lab-grown diamond production.",
    contactPoint: {
      "@type": "ContactPoint",
      email: "sourcing@steelneststore.com",
      contactType: "sales",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
