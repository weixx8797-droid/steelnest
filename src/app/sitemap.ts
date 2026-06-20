import { type MetadataRoute } from "next";
import { getAllProducts } from "@/data/products";

/**
 * sitemap.xml — 搜索引擎靠这个发现你网站的所有页面
 * Next.js 在 /sitemap.xml 自动提供此文件
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // 静态页面
  const staticPages = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 },
    { url: `${siteUrl}/shop`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${siteUrl}/faq`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${siteUrl}/shipping`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.4 },
    { url: `${siteUrl}/returns`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.4 },
    { url: `${siteUrl}/privacy`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${siteUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  // 产品动态页面
  const products = getAllProducts();
  const productPages = products.map((p) => ({
    url: `${siteUrl}/products/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...productPages];
}
