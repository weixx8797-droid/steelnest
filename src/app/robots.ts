import { type MetadataRoute } from "next";

/**
 * robots.txt — 告诉搜索引擎哪些页面可以抓取
 * Next.js 在 /robots.txt 自动提供此文件
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/checkout/", "/cart"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
