import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import LayoutWrapper from "@/components/LayoutWrapper";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { OrganizationJsonLd } from "@/lib/structured-data";
import "./globals.css";

// ---- 字体配置 ----
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

// ---- 站点 URL ----
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// ---- SEO 元数据（Google 搜索会显示） ----
export const metadata: Metadata = {
  title: {
    default: "SteelNest — Premium Recyclable Steel Home Organization",
    template: "%s | SteelNest",
  },
  description:
    "Discover SteelNest: premium recyclable steel storage racks, desk organizers, and bathroom accessories. Steel over wood — stronger homes, fewer trees. Free shipping over $49.",
  keywords: [
    "steel storage",
    "metal organizer",
    "recyclable home products",
    "eco-friendly storage",
    "sustainable home organization",
    "steel furniture",
    "factory direct",
  ],
  // Open Graph（社交分享预览）
  openGraph: {
    type: "website",
    siteName: "SteelNest",
    title: "SteelNest — Premium Recyclable Steel Home Organization",
    description:
      "Steel over wood. Stronger homes, fewer trees. Factory-direct from Luoyang.",
    url: siteUrl,
    images: [
      {
        url: `${siteUrl}/logo-icon.svg`,
        width: 200,
        height: 200,
        alt: "SteelNest Logo",
      },
    ],
  },
  // Twitter 分享卡片
  twitter: {
    card: "summary",
    title: "SteelNest — Steel Over Wood",
    description:
      "Premium recyclable steel home organization. Factory-direct from Luoyang.",
    images: [`${siteUrl}/logo-icon.svg`],
  },
  // 网站验证（后续在 Google Search Console 验证用）
  verification: {
    // google: "你的 Google 验证码",  // 上线后填入
  },
};

// ---- 根布局（整个网站的外壳） ----
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-brand-cream text-brand-charcoal antialiased">
        <LayoutWrapper>{children}</LayoutWrapper>

        {/* Google Analytics（仅生产环境加载） */}
        <GoogleAnalytics />

        {/* JSON-LD 结构化数据（搜索引擎用） */}
        <OrganizationJsonLd />
      </body>
    </html>
  );
}
