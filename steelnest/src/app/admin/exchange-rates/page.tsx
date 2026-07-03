"use client";

/**
 * 汇率看板页面
 * 查看实时汇率 + 定价计算器
 */

import { useState, useEffect } from "react";

interface RatesData {
  base: string;
  rates: Record<string, number>;
  updatedAt: string;
  source: string;
}

const currencyLabels: Record<string, { name: string; symbol: string; flag: string }> = {
  CNY: { name: "人民币", symbol: "¥", flag: "🇨🇳" },
  EUR: { name: "欧元", symbol: "€", flag: "🇪🇺" },
  GBP: { name: "英镑", symbol: "£", flag: "🇬🇧" },
  JPY: { name: "日元", symbol: "¥", flag: "🇯🇵" },
  CAD: { name: "加元", symbol: "C$", flag: "🇨🇦" },
  AUD: { name: "澳元", symbol: "A$", flag: "🇦🇺" },
};

export default function ExchangeRatesPage() {
  const [rates, setRates] = useState<RatesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [usdAmount, setUsdAmount] = useState(100);

  const fetchRates = async () => {
    const res = await fetch("/api/admin/exchange-rates");
    setRates(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetch("/api/admin/exchange-rates", { method: "POST" });
    await fetchRates();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">汇率看板</h1>
        <p className="text-sm text-gray-500">加载中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* 页头 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">💱 汇率看板</h1>
          <p className="text-xs text-gray-400 mt-1">
            基准货币：USD | 数据来源：{rates?.source || "本地缓存"} | 更新：{rates?.updatedAt?.slice(0, 10) || "未知"}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="px-4 py-2 text-sm bg-brand-copper/10 text-brand-copper rounded-md hover:bg-brand-copper hover:text-white transition-colors disabled:opacity-50"
        >
          {refreshing ? "刷新中..." : "🔄 刷新汇率"}
        </button>
      </div>

      {/* 汇率卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rates &&
          Object.entries(rates.rates).map(([code, rate]) => {
            const info = currencyLabels[code] || { name: code, symbol: "", flag: "" };
            return (
              <div key={code} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="text-sm text-gray-500 mb-1">
                  {info.flag} USD → {code} ({info.name})
                </div>
                <div className="text-2xl font-bold text-gray-700">
                  {info.symbol}{rate.toFixed(4)}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  1 USD = {rate.toFixed(4)} {code}
                </div>
              </div>
            );
          })}
      </div>

      {/* 定价计算器 */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700">🧮 定价计算器</h2>
        <p className="text-xs text-gray-400">
          输入美元金额，自动换算各币种参考价
        </p>

        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-500">$</label>
          <input
            type="number"
            value={usdAmount}
            onChange={(e) => setUsdAmount(Number(e.target.value) || 0)}
            className="w-32 px-3 py-2 border border-gray-200 rounded text-sm"
          />
          <span className="text-sm text-gray-400">USD</span>
        </div>

        {/* 换算结果 */}
        {rates && usdAmount > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(rates.rates).map(([code, rate]) => {
              const converted = (usdAmount * rate).toFixed(2);
              const info = currencyLabels[code] || { name: code, symbol: code, flag: "" };
              return (
                <div
                  key={code}
                  className="p-3 bg-brand-cream rounded border border-gray-100"
                >
                  <div className="text-xs text-gray-500">
                    {info.flag} {info.name}
                  </div>
                  <div className="text-lg font-bold text-gray-700">
                    {info.symbol}{converted}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 定价建议 */}
        {rates && rates.rates.CNY && usdAmount > 0 && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm">
            <span className="text-blue-700 font-medium">💡 定价建议：</span>
            <span className="text-blue-600">
              成本 ${usdAmount} → 建议零售 ${(usdAmount * 3).toFixed(2)}（3倍）
              ≈ ¥{(usdAmount * 3 * rates.rates.CNY).toFixed(0)} 人民币
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
