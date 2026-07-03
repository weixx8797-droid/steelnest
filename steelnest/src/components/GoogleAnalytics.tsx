"use client";

import Script from "next/script";

/**
 * Google Analytics 4 追踪脚本
 *
 * 使用方法：
 * 1. 去 https://analytics.google.com 创建账号
 * 2. 获取 Measurement ID（格式：G-XXXXXXXXXX）
 * 3. 在 .env.local 中添加 NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
 * 4. 此组件自动加载
 */
export default function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  // 没有 GA ID 就不加载（本地开发时跳过）
  if (!gaId || gaId === "G-XXXXXXXXXX") {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}
