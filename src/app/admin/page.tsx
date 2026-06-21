import { getAllProducts } from "@/data/products";
import DashboardStats from "@/components/admin/DashboardStats";

/**
 * 管理后台 — 仪表盘首页
 */
export default async function AdminDashboardPage() {
  const products = getAllProducts();

  // 模拟统计数据（后续从实际数据源读取）
  const stats = {
    totalOrders: 0,
    totalProducts: products.length,
    activeInquiries: 0,
    monthlyRevenue: 0,
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">仪表盘</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          欢迎回来，这是你的 SteelNest 管理中枢
        </p>
      </div>

      {/* 统计卡片 */}
      <DashboardStats stats={stats} />

      {/* 快速操作 + 最近动态 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 快速操作 */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            ⚡ 快速操作
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <a
              href="/admin/products"
              className="p-3 bg-brand-cream rounded-md text-sm hover:bg-brand-light transition-colors"
            >
              <span className="block font-medium text-gray-700">管理产品</span>
              <span className="text-xs text-gray-400">编辑/上下架</span>
            </a>
            <a
              href="/admin/suppliers"
              className="p-3 bg-brand-cream rounded-md text-sm hover:bg-brand-light transition-colors"
            >
              <span className="block font-medium text-gray-700">添加供应商</span>
              <span className="text-xs text-gray-400">录入供应商信息</span>
            </a>
            <a
              href="/admin/settings"
              className="p-3 bg-brand-cream rounded-md text-sm hover:bg-brand-light transition-colors"
            >
              <span className="block font-medium text-gray-700">系统设置</span>
              <span className="text-xs text-gray-400">品牌/运费/邮件</span>
            </a>
            <a
              href="/"
              target="_blank"
              className="p-3 bg-brand-cream rounded-md text-sm hover:bg-brand-light transition-colors"
            >
              <span className="block font-medium text-gray-700">查看独立站</span>
              <span className="text-xs text-gray-400">新窗口打开</span>
            </a>
          </div>
        </div>

        {/* 系统状态 */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            🖥️ 系统状态
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-500">前端框架</span>
              <span className="text-gray-700">Next.js 16 (Turbopack)</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-500">部署平台</span>
              <span className="text-gray-700">Vercel (Hobby)</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-500">数据存储</span>
              <span className="text-gray-700">JSON + GitHub</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-500">支付系统</span>
              <span className="text-green-600">Stripe + PayPal ✅</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-500">模块状态</span>
              <span className="text-xs text-gray-400">
                邮件 ⚪ | 铺货 ⚪ | ACCIO ⚪
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 产品快速概览 */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">
          📦 当前在售产品（{products.length} 款）
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                <th className="pb-2 pr-4">产品名</th>
                <th className="pb-2 pr-4">分类</th>
                <th className="pb-2 pr-4">售价</th>
                <th className="pb-2">状态</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr
                  key={p.slug}
                  className="border-b border-gray-50 hover:bg-gray-50"
                >
                  <td className="py-2.5 pr-4 font-medium text-gray-700">
                    {p.name}
                  </td>
                  <td className="py-2.5 pr-4 text-gray-500 capitalize">
                    {p.category}
                  </td>
                  <td className="py-2.5 pr-4 text-gray-700">
                    ${p.price.toFixed(2)}
                  </td>
                  <td className="py-2.5">
                    {p.inStock ? (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        在售
                      </span>
                    ) : (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                        下架
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
