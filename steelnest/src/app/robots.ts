import { type MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

/**
 * robots.txt — 告诉搜索引擎哪些页面可以抓取
 * Next.js 在 /robots.txt 自动提供此文件
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin", "/admin/", "/checkout/", "/cart"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
