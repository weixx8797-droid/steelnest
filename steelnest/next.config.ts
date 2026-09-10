import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // 改版后是 B2B 询价制，不再有在线下单流程。
      // 老站是零售站，这些地址可能还被搜索引擎收录着，统一转到询价页。
      { source: "/cart", destination: "/contact", permanent: true },
      { source: "/checkout", destination: "/contact", permanent: true },
      { source: "/checkout/:path*", destination: "/contact", permanent: true },
    ];
  },
};

export default nextConfig;
