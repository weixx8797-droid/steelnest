"use client";

import { useState, useEffect } from "react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [apiStatus, setApiStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then(setSettings)
      .finally(() => setLoading(false));
    // 检查 API 配置状态
    fetch("/api/admin/settings/api-status")
      .then((r) => r.json())
      .then(setApiStatus)
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setMessage("✅ 设置已保存");
      } else {
        setMessage("❌ 保存失败");
      }
    } catch {
      setMessage("❌ 网络错误");
    } finally {
      setSaving(false);
    }
  };

  const updateNested = (
    path: string[],
    value: string | number | boolean
  ) => {
    const updated = { ...settings };
    let current: Record<string, unknown> = updated;
    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) current[path[i]] = {};
      current = current[path[i]] as Record<string, unknown>;
    }
    current[path[path.length - 1]] = value;
    setSettings(updated);
  };

  const getNested = (path: string[]): string => {
    let current: Record<string, unknown> = settings;
    for (const key of path) {
      if (!current || typeof current !== "object") return "";
      current = current[key] as Record<string, unknown>;
    }
    return String(current ?? "");
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">系统设置</h1>
        <p className="text-sm text-gray-500">加载中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800">系统设置</h1>

      {message && (
        <div className="text-sm px-3 py-2 bg-gray-50 border border-gray-200 rounded">
          {message}
        </div>
      )}

      {/* 品牌设置 */}
      <section className="bg-white rounded-lg border border-gray-200 p-5 space-y-3">
        <h2 className="text-sm font-semibold text-gray-700">品牌信息</h2>
        <div className="space-y-3">
          <Field label="品牌名" value={getNested(["brand", "name"])} onChange={(v) => updateNested(["brand", "name"], v)} />
          <Field label="Slogan" value={getNested(["brand", "slogan"])} onChange={(v) => updateNested(["brand", "slogan"], v)} />
          <Field label="主色调" value={getNested(["brand", "primaryColor"])} onChange={(v) => updateNested(["brand", "primaryColor"], v)} />
        </div>
      </section>

      {/* 物流设置 */}
      <section className="bg-white rounded-lg border border-gray-200 p-5 space-y-3">
        <h2 className="text-sm font-semibold text-gray-700">物流设置</h2>
        <div className="grid grid-cols-2 gap-3">
          <Field label="包邮门槛 (USD)" value={getNested(["shipping", "freeThreshold"])} onChange={(v) => updateNested(["shipping", "freeThreshold"], Number(v))} type="number" />
          <Field label="固定运费 (USD)" value={getNested(["shipping", "flatFee"])} onChange={(v) => updateNested(["shipping", "flatFee"], Number(v))} type="number" />
        </div>
      </section>

      {/* 定价设置 */}
      <section className="bg-white rounded-lg border border-gray-200 p-5 space-y-3">
        <h2 className="text-sm font-semibold text-gray-700">定价策略</h2>
        <Field label="默认加价倍率（成本 × N = 零售）" value={getNested(["pricing", "defaultMarkupMultiplier"])} onChange={(v) => updateNested(["pricing", "defaultMarkupMultiplier"], Number(v))} type="number" />
      </section>

      {/* API 预算 */}
      <section className="bg-white rounded-lg border border-gray-200 p-5 space-y-3">
        <h2 className="text-sm font-semibold text-gray-700">API 预算上限 (USD/月)</h2>
        <div className="grid grid-cols-2 gap-3">
          <Field label="OpenAI 月预算" value={getNested(["apiBudget", "openaiMonthlyLimit"])} onChange={(v) => updateNested(["apiBudget", "openaiMonthlyLimit"], Number(v))} type="number" />
          <Field label="图像API 月预算" value={getNested(["apiBudget", "imageApiMonthlyLimit"])} onChange={(v) => updateNested(["apiBudget", "imageApiMonthlyLimit"], Number(v))} type="number" />
        </div>
      </section>

      {/* ===== API 密钥配置状态 ===== */}
      <section className="bg-white rounded-lg border border-gray-200 p-5 space-y-3">
        <h2 className="text-sm font-semibold text-gray-700">🔑 API 密钥配置状态</h2>
        <p className="text-xs text-gray-400">
          密钥在项目根目录的 <code className="bg-gray-100 px-1 rounded">.env.local</code> 文件中配置。<br />
          邮箱密码在 <code className="bg-gray-100 px-1 rounded">email-worker/config.py</code> 中配置。
        </p>
        <div className="space-y-2">
          {[
            { key: "DEEPSEEK_API_KEY", name: "DeepSeek（AI 解析报价/文案）", desc: "不配也能用，AI功能降级" },
            { key: "STRIPE_SECRET_KEY", name: "Stripe 支付", desc: "上线收款必须配置" },
            { key: "NEXT_PUBLIC_PAYPAL_CLIENT_ID", name: "PayPal 支付", desc: "上线收款必须配置" },
            { key: "RESEND_API_KEY", name: "Resend 邮件服务", desc: "自动发订单邮件用" },
            { key: "REMOVE_BG_API_KEY", name: "remove.bg 去背景", desc: "AI营销图生成用" },
            { key: "REPLICATE_API_KEY", name: "Replicate 图像生成", desc: "AI营销图生成用" },
            { key: "GITHUB_TOKEN", name: "GitHub Token", desc: "管理后台数据写入用" },
          ].map((api) => (
            <div
              key={api.key}
              className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded text-xs"
            >
              <div>
                <span className="font-medium text-gray-700">{api.name}</span>
                <span className="text-gray-400 ml-2">({api.desc})</span>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                  apiStatus[api.key]
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {apiStatus[api.key] ? "✅ 已配置" : "⚪ 未配置"}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 保存按钮 */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="px-6 py-2.5 bg-brand-charcoal text-white rounded-md text-sm font-medium hover:bg-brand-copper transition-colors disabled:opacity-50"
      >
        {saving ? "保存中..." : "保存设置"}
      </button>
    </div>
  );
}

/** 表单字段小组件 */
function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string | number) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(type === "number" ? Number(e.target.value) : e.target.value)
        }
        className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand-copper/30"
      />
    </div>
  );
}
