export default function AdminAccioPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">ACCIO 对接</h1>

      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <div className="text-4xl mb-3">🤖</div>
        <p className="text-gray-500 text-sm font-medium">功能开发中</p>
        <p className="text-gray-400 text-xs mt-1 max-w-md mx-auto">
          ACCIO Worker Agent 是阿里巴巴国际站的 AI 采购助手。
          等 ACCIO 开放 API 后，这里将展示 AI 自动找货、比价、推荐供应商的结果。
        </p>
        <div className="mt-6 inline-block bg-yellow-50 border border-yellow-200 rounded px-4 py-2 text-xs text-yellow-700">
          ⚠️ 你需要先注册 ACCIO 并获取 API 权限才能使用此功能
        </div>
      </div>
    </div>
  );
}
