"use client";

/**
 * 铺货中心 — 选品 → 定价 → 上架流程
 */

import { useState, useEffect } from "react";

interface SourcingItem {
  id: string;
  quoteId: string | null;
  supplierId: string | null;
  retailPriceUSD: number;
  englishName: string;
  englishDescription: string;
  tagline: string;
  category: string;
  images: string[];
  marketingImages: string[];
  marketingGenerated: boolean;
  tags: string[];
  status: "draft" | "approved" | "published";
  createdAt: string;
}

export default function AdminSourcingPage() {
  const [queue, setQueue] = useState<SourcingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<SourcingItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [costPrice, setCostPrice] = useState(10);
  const [markup, setMarkup] = useState(3);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});

  // 表单状态
  const [form, setForm] = useState({
    englishName: "",
    tagline: "",
    englishDescription: "",
    category: "desk",
    retailPriceUSD: 29.99,
    images: "",
    supplierId: "",
  });

  const fetchQueue = () => {
    fetch("/api/admin/sourcing")
      .then((r) => r.json())
      .then(setQueue)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchQueue();
    fetch("/api/admin/exchange-rates")
      .then((r) => r.json())
      .then((d) => setExchangeRates(d.rates || {}));
  }, []);

  // 添加新产品
  const handleAdd = async () => {
    const images = form.images
      ? form.images.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const res = await fetch("/api/admin/sourcing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        englishName: form.englishName,
        tagline: form.tagline,
        englishDescription: form.englishDescription,
        category: form.category,
        retailPriceUSD: form.retailPriceUSD,
        images,
        supplierId: form.supplierId || null,
      }),
    });

    if (res.ok) {
      setMessage("✅ 产品已添加到铺货队列");
      setShowForm(false);
      setForm({ englishName: "", tagline: "", englishDescription: "", category: "desk", retailPriceUSD: 29.99, images: "", supplierId: "" });
      fetchQueue();
    } else {
      setMessage("❌ 添加失败");
    }
  };

  // 审批/更新状态
  const handleStatus = async (item: SourcingItem, newStatus: string) => {
    await fetch("/api/admin/sourcing", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, status: newStatus }),
    });
    fetchQueue();
  };

  // 更新定价
  const handlePriceUpdate = async (item: SourcingItem, price: number) => {
    await fetch("/api/admin/sourcing", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, retailPriceUSD: price }),
    });
    fetchQueue();
    setEditing(null);
    setMessage("✅ 价格已更新");
  };

  // 上架到独立站
  const handlePublish = async (item: SourcingItem) => {
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        englishName: item.englishName,
        tagline: item.tagline,
        englishDescription: item.englishDescription,
        category: item.category,
        retailPriceUSD: item.retailPriceUSD,
        images: [...item.images, ...item.marketingImages],
      }),
    });

    if (res.ok) {
      await handleStatus(item, "published");
      setMessage("✅ 产品已上架！需要提交到 GitHub 后 Vercel 才会更新。");
    } else {
      setMessage("❌ 上架失败");
    }
  };

  const cnyRate = exchangeRates?.CNY || 7.25;

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">铺货中心</h1>
        <p className="text-sm text-gray-500">加载中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* 页头 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">🚀 铺货中心</h1>
          <p className="text-xs text-gray-400 mt-1">
            选品 → AI 生成营销图 → 定价 → 一键上架
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-brand-copper text-white rounded-md text-sm hover:bg-brand-copper/80 transition-colors"
        >
          {showForm ? "取消" : "+ 添加新品"}
        </button>
      </div>

      {message && (
        <div className={`text-sm px-3 py-2 rounded ${message.includes("✅") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {message}
        </div>
      )}

      {/* 定价计算器 */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-4 flex-wrap">
        <span className="text-sm font-medium text-gray-600">💰 定价参考：</span>
        <label className="text-xs text-gray-500">
          成本 $
          <input type="number" value={costPrice} onChange={(e) => setCostPrice(Number(e.target.value))} className="w-20 mx-1 px-2 py-1 border rounded text-sm" />
        </label>
        <label className="text-xs text-gray-500">
          倍率 ×
          <input type="number" value={markup} onChange={(e) => setMarkup(Number(e.target.value))} className="w-16 mx-1 px-2 py-1 border rounded text-sm" />
        </label>
        <span className="text-lg font-bold text-brand-charcoal">
          = ${(costPrice * markup).toFixed(2)}
        </span>
        <span className="text-sm text-gray-400">
          ≈ ¥{(costPrice * markup * cnyRate).toFixed(0)}
        </span>
      </div>

      {/* 添加新品表单 */}
      {showForm && (
        <div className="bg-white rounded-lg border border-brand-copper/30 p-5 space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">📝 添加新品到铺货队列</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="英文产品名 *" value={form.englishName} onChange={(v) => setForm({ ...form, englishName: v })} placeholder="如: Steel Desk Organizer" />
            <Field label="一句话卖点" value={form.tagline} onChange={(v) => setForm({ ...form, tagline: v })} placeholder="如: Tame your desk clutter" />
            <Field label="售价 USD *" value={String(form.retailPriceUSD)} onChange={(v) => setForm({ ...form, retailPriceUSD: Number(v) || 0 })} type="number" />
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">分类</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded text-sm">
                <option value="desk">桌面收纳 (desk)</option>
                <option value="storage">储物 (storage)</option>
                <option value="bathroom">卫浴 (bathroom)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">产品图片路径（逗号分隔）</label>
            <input type="text" value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} placeholder="/products/xxx.jpg, /products/yyy.jpg" className="w-full px-3 py-2 border border-gray-200 rounded text-sm" />
          </div>
          <Field label="英文产品描述" value={form.englishDescription} onChange={(v) => setForm({ ...form, englishDescription: v })} placeholder="详细的产品描述..." />
          <button onClick={handleAdd} className="px-6 py-2 bg-brand-charcoal text-white rounded-md text-sm hover:bg-brand-copper transition-colors">确认添加</button>
        </div>
      )}

      {/* 铺货队列 */}
      {queue.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-gray-500 text-sm">铺货队列为空</p>
          <p className="text-gray-400 text-xs mt-1">点击「添加新品」开始，或从 AI 询盘解析结果中导入</p>
        </div>
      ) : (
        <div className="space-y-3">
          {queue.map((item) => {
            const isPublished = item.status === "published";
            const isApproved = item.status === "approved";

            return (
              <div key={item.id} className={`bg-white rounded-lg border p-4 ${isPublished ? "border-green-300 bg-green-50/30" : isApproved ? "border-brand-copper/30" : "border-gray-200"}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-gray-700 truncate">
                        {item.englishName || "未命名产品"}
                      </h3>
                      <StatusBadge status={item.status} />
                    </div>
                    {item.tagline && <p className="text-xs text-gray-500 mb-1">{item.tagline}</p>}
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>分类: {item.category}</span>
                      <span className="font-medium text-gray-600">${item.retailPriceUSD.toFixed(2)}</span>
                      <span>≈ ¥{(item.retailPriceUSD * cnyRate).toFixed(0)}</span>
                      {item.marketingGenerated && <span className="text-green-500">🎨 营销图已生成</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.status === "draft" && (
                      <button onClick={() => handleStatus(item, "approved")} className="px-3 py-1.5 text-xs bg-brand-copper/10 text-brand-copper rounded hover:bg-brand-copper hover:text-white transition-colors">
                        审批通过
                      </button>
                    )}
                    {isApproved && (
                      <>
                        <button onClick={() => setEditing(item)} className="px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors">
                          修改定价
                        </button>
                        <button onClick={() => handlePublish(item)} className="px-3 py-1.5 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
                          上架
                        </button>
                      </>
                    )}
                    {isPublished && (
                      <span className="text-xs text-green-600">已上架 ✅</span>
                    )}
                  </div>
                </div>

                {/* 编辑定价弹窗 */}
                {editing?.id === item.id && (
                  <div className="mt-3 pt-3 border-t border-gray-200 flex items-center gap-3">
                    <label className="text-xs text-gray-500">
                      零售价 $
                      <input type="number" step="0.01" value={editing.retailPriceUSD} onChange={(e) => setEditing({ ...editing, retailPriceUSD: Number(e.target.value) })} className="w-24 mx-1 px-2 py-1 border rounded text-sm" />
                    </label>
                    <span className="text-xs text-gray-400">≈ ¥{(editing.retailPriceUSD * cnyRate).toFixed(0)}</span>
                    <button onClick={() => handlePriceUpdate(item, editing.retailPriceUSD)} className="px-3 py-1 text-xs bg-brand-charcoal text-white rounded">确认</button>
                    <button onClick={() => setEditing(null)} className="px-3 py-1 text-xs text-gray-400">取消</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    draft: { label: "草稿", cls: "bg-gray-100 text-gray-500" },
    approved: { label: "已审批", cls: "bg-brand-copper/10 text-brand-copper" },
    published: { label: "已上架", cls: "bg-green-100 text-green-600" },
  };
  const info = map[status] || map.draft;
  return <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${info.cls}`}>{info.label}</span>;
}

function Field({ label, value, onChange, type = "text", placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full px-3 py-2 border border-gray-200 rounded text-sm" />
    </div>
  );
}
