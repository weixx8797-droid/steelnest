import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import LayoutWrapper from "@/components/LayoutWrapper";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { OrganizationJsonLd } from "@/lib/structured-data";
import { getSiteUrl } from "@/lib/site";
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
const siteUrl = getSiteUrl();

// ---- SEO 元数据（Google 搜索会显示） ----
export const metadata: Metadata = {
  // 所有相对地址（含分享图）都以正式域名为基准，预览部署不会写出 localhost
  metadataBase: new URL(siteUrl),
  title: {
    default: "LabOrigin — Lab-Grown Diamonds Direct From the Source",
    template: "%s | LabOrigin",
  },
  description:
    "LabOrigin is a B2B lab-grown diamond supply-chain portal. Loose diamonds, quality auditing, and white-label manufacturing direct from Henan, China — the world's hub of HPHT/CVD production. IGI & GIA certified.",
  keywords: [
    "lab grown diamonds",
    "lab grown diamond supplier",
    "HPHT diamonds",
    "CVD diamonds",
    "loose diamonds wholesale",
    "IGI certified diamonds",
    "GIA certified diamonds",
    "white label jewelry",
    "diamond sourcing",
    "Henan diamond factory",
  ],
  // Open Graph（社交分享预览）
  openGraph: {
    type: "website",
    siteName: "LabOrigin",
    title: "LabOrigin — Lab-Grown Diamonds Direct From the Source",
    description:
      "Lab-grown diamond sourcing, quality auditing, and white-label manufacturing direct from Henan, China. IGI & GIA certified.",
    url: siteUrl,
    // 图片由 src/app/opengraph-image.tsx 自动生成（1200x630 PNG）
  },
  // Twitter 分享卡片
  twitter: {
    card: "summary_large_image",
    title: "LabOrigin — Lab-Grown Diamonds Direct From the Source",
    description:
      "Lab-grown diamond supply chain direct from Henan, China. IGI & GIA certified.",
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
