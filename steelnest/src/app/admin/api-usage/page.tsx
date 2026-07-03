"use client";

/**
 * API 用量监控页面
 * 展示各 API 调用次数、Token 数、费用预估
 */

import { useState, useEffect } from "react";

interface ApiUsageData {
  records: unknown[];
  summary: {
    openai?: { calls: number; tokens: number; estimatedCost: number };
    imageApi?: { calls: number; images: number; estimatedCost: number };
    emailSent?: number;
    exchangeRateApi?: { calls: number };
  };
  monthlyEstimate: {
    openai: number;
    imageApi: number;
    total: number;
  };
}

export default function ApiUsagePage() {
  const [data, setData] = useState<ApiUsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/api-usage")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">API 用量监控</h1>
        <p className="text-sm text-gray-500">加载中...</p>
      </div>
    );
  }

  const summary = data?.summary || {};
  const estimate = data?.monthlyEstimate || { openai: 0, imageApi: 0, total: 0 };

  const apis = [
    {
      name: "OpenAI",
      icon: "🤖",
      description: "询盘解析 + 文案生成 + 报价提取",
      calls: summary.openai?.calls || 0,
      detail1: `${(summary.openai?.tokens || 0).toLocaleString()} tokens`,
      detail2: `$${(summary.openai?.estimatedCost || 0).toFixed(4)}/天`,
      monthlyCost: estimate.openai,
      color: "green",
    },
    {
      name: "图像 API",
      icon: "🎨",
      description: "remove.bg + Replicate 图像生成",
      calls: summary.imageApi?.calls || 0,
      detail1: `${summary.imageApi?.images || 0} 张`,
      detail2: `$${(summary.imageApi?.estimatedCost || 0).toFixed(4)}/天`,
      monthlyCost: estimate.imageApi,
      color: "purple",
    },
    {
      name: "汇率 API",
      icon: "💱",
      description: "Frankfurter 每日汇率抓取",
      calls: summary.exchangeRateApi?.calls || 0,
      detail1: "免费",
      detail2: "$0/天",
      monthlyCost: 0,
      color: "blue",
    },
    {
      name: "邮件发送",
      icon: "✉️",
      description: "Resend 询盘邮件发送",
      calls: summary.emailSent || 0,
      detail1: `${summary.emailSent || 0} 封`,
      detail2: "免费额度内",
      monthlyCost: 0,
      color: "copper",
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">📊 API 用量监控</h1>
        <p className="text-xs text-gray-400 mt-1">
          数据实时更新 | 用于控制 AI API 成本
        </p>
      </div>

      {/* 月度预估总览 */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">💰 本月费用预估</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-xs text-gray-500">OpenAI</div>
            <div className="text-lg font-bold text-green-600">
              ~${estimate.openai.toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">图像 API</div>
            <div className="text-lg font-bold text-purple-600">
              ~${estimate.imageApi.toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">月度合计</div>
            <div className="text-lg font-bold text-brand-charcoal">
              ~${estimate.total.toFixed(2)}
            </div>
          </div>
        </div>

        {/* 预算预警 */}
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
          💡 提示：API 调用费用很低，正常使用每月约 $3-8。可在「系统设置」中设置月度预算上限。
        </div>
      </div>

      {/* 各 API 详情 */}
      <div className="space-y-3">
        {apis.map((api) => {
          const colorMap: Record<string, string> = {
            green: "border-l-green-500",
            purple: "border-l-purple-500",
            blue: "border-l-blue-500",
            copper: "border-l-brand-copper",
          };

          return (
            <div
              key={api.name}
              className={`bg-white rounded-lg border border-gray-200 border-l-4 ${colorMap[api.color]} p-4`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{api.icon}</span>
                  <div>
                    <div className="text-sm font-semibold text-gray-700">
                      {api.name}
                    </div>
                    <div className="text-xs text-gray-400">{api.description}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-700">
                    {api.calls} 次
                  </div>
                  <div className="text-xs text-gray-400">
                    预估 ~${api.monthlyCost.toFixed(2)}/月
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-3 text-xs text-gray-500">
                <span>{api.detail1}</span>
                <span>{api.detail2}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 使用说明 */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-2">📖 费用参考</h2>
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left text-gray-400 border-b border-gray-100">
              <th className="py-2">API</th>
              <th className="py-2">单价</th>
              <th className="py-2">示例用量</th>
              <th className="py-2">预估月费</th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            <tr className="border-b border-gray-50">
              <td className="py-2">OpenAI GPT-4o-mini</td>
              <td className="py-2">$0.15 / 1M tokens</td>
              <td className="py-2">每天 50 次调用</td>
              <td className="py-2">~$1.50/月</td>
            </tr>
            <tr className="border-b border-gray-50">
              <td className="py-2">remove.bg</td>
              <td className="py-2">免费 50 张/月</td>
              <td className="py-2">每月 30 张</td>
              <td className="py-2">$0</td>
            </tr>
            <tr className="border-b border-gray-50">
              <td className="py-2">Replicate</td>
              <td className="py-2">~$0.03/张</td>
              <td className="py-2">每月 20 张</td>
              <td className="py-2">~$0.60/月</td>
            </tr>
            <tr>
              <td className="py-2">Resend 邮件</td>
              <td className="py-2">免费 100 封/天</td>
              <td className="py-2">每天 20 封</td>
              <td className="py-2">$0</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
