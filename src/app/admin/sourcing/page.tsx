"use client";

/**
 * 铺货中心 v3 — 传图一条龙
 *
 * 流程：上传产品图 → AI 分析生成产品信息 → 预览/编辑 → 一键上架
 */

import { useState, useEffect, useRef } from "react";

interface ProductInfo {
  name: string;
  tagline: string;
  category: string;
  suggestedPrice: number;
  features: string[];
  description: string;
  specs: { material?: string; dimensions?: string; weightCapacity?: string; weight?: string };
  colors: { name: string; hex: string }[];
  seoKeywords: string[];
}

interface QueueItem {
  id: string;
  englishName: string;
  tagline: string;
  englishDescription: string;
  category: string;
  retailPriceUSD: number;
  images: string[];
  features: string[];
  specs: Record<string, string>;
  colors: { name: string; hex: string }[];
  status: "draft" | "approved" | "published";
  createdAt: string;
}

const CATEGORIES = [
  { value: "desk", label: "桌面收纳 (Desk)" },
  { value: "storage", label: "储物 (Storage)" },
  { value: "bathroom", label: "卫浴 (Bathroom)" },
];

export default function AdminSourcingPage() {
  // ===== 状态 =====
  const [step, setStep] = useState<"upload" | "analyze" | "review" | "done">("upload");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null); // base64 预览
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [userHint, setUserHint] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
  const [editedInfo, setEditedInfo] = useState<ProductInfo | null>(null);
  const [message, setMessage] = useState("");
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/sourcing").then((r) => r.json()).then(setQueue).finally(() => setLoading(false));
  }, []);

  // ===== 步骤1: 上传图片 =====
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result as string);
      setStep("analyze");
    };
    reader.readAsDataURL(file);
  };

  // ===== 步骤2: AI 分析 =====
  const handleAIAnalyze = async () => {
    if (!uploadedImage) return;
    setAnalyzing(true);
    setMessage("");

    try {
      // 把 base64 转回 File
      const base64Res = await fetch(uploadedImage);
      const blob = await base64Res.blob();
      const file = new File([blob], uploadedFileName, { type: blob.type });

      const formData = new FormData();
      formData.append("image", file);
      formData.append("hint", userHint || "steel home organization product");

      const res = await fetch("/api/admin/ai-analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("AI 分析失败");

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setProductInfo(data.product);
      setEditedInfo(data.product);
      setStep("review");
    } catch (err) {
      setMessage("❌ " + (err instanceof Error ? err.message : "未知错误"));
    } finally {
      setAnalyzing(false);
    }
  };

  // ===== 步骤3: 审核 + 上架 =====
  const handlePublish = async () => {
    if (!editedInfo) return;
    setPublishing(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/sourcing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          englishName: editedInfo.name,
          tagline: editedInfo.tagline,
          englishDescription: editedInfo.description,
          category: editedInfo.category,
          retailPriceUSD: editedInfo.suggestedPrice,
          features: editedInfo.features,
          specs: editedInfo.specs,
          colors: editedInfo.colors,
          images: uploadedImage ? [uploadedImage] : [],
        }),
      });

      if (!res.ok) throw new Error("上架失败");
      const data = await res.json();

      setMessage("✅ 产品已上架！");
      setStep("done");

      // 刷新队列
      fetch("/api/admin/sourcing").then((r) => r.json()).then(setQueue);
    } catch (err) {
      setMessage("❌ " + (err instanceof Error ? err.message : "未知错误"));
    } finally {
      setPublishing(false);
    }
  };

  // 重置，再来一个
  const handleReset = () => {
    setStep("upload");
    setUploadedImage(null);
    setUploadedFileName("");
    setUserHint("");
    setProductInfo(null);
    setEditedInfo(null);
    setMessage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ===== 渲染 =====
  if (loading) return <div className="p-6 text-sm text-gray-500">加载中...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-800">🚀 铺货中心</h1>

      {message && (
        <div className={`text-sm px-4 py-2.5 rounded-lg ${message.includes("✅") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {message}
        </div>
      )}

      {/* ===== 步骤1: 上传 ===== */}
      {step === "upload" && (
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center hover:border-brand-copper/50 transition-colors">
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
          <label htmlFor="image-upload" className="cursor-pointer block">
            <div className="text-5xl mb-4">📸</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">点击上传产品图片</h3>
            <p className="text-sm text-gray-400">支持 JPG、PNG、WebP，建议 800×800 以上</p>
          </label>
        </div>
      )}

      {/* ===== 步骤2: AI 分析 ===== */}
      {step === "analyze" && uploadedImage && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 左侧：预览图 */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">📷 产品原图</h3>
            <img src={uploadedImage} alt="Product" className="w-full rounded-lg object-contain max-h-80" />
            <p className="text-xs text-gray-400 mt-2 truncate">{uploadedFileName}</p>
          </div>

          {/* 右侧：描述 + 分析按钮 */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-gray-600">🤖 AI 智能分析</h3>
            <p className="text-xs text-gray-400">
              简单描述一下这个产品（中文也可以），AI 会自动生成完整的英文产品页
            </p>
            <textarea
              value={userHint}
              onChange={(e) => setUserHint(e.target.value)}
              placeholder="例：不锈钢桌面收纳架，三层可叠放，免工具安装"
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-brand-copper/30 focus:outline-none"
            />
            <button
              onClick={handleAIAnalyze}
              disabled={analyzing}
              className="w-full py-3 bg-brand-copper text-white rounded-lg font-medium hover:bg-brand-copper/80 transition-colors disabled:opacity-50"
            >
              {analyzing ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span> AI 分析中...
                </span>
              ) : (
                "🚀 开始分析"
              )}
            </button>
            <button onClick={handleReset} className="text-xs text-gray-400 hover:text-gray-600">← 重新上传</button>
          </div>
        </div>
      )}

      {/* ===== 步骤3: 审核 + 编辑 ===== */}
      {step === "review" && editedInfo && uploadedImage && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 左侧：图片预览 */}
          <div className="space-y-3">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <img src={uploadedImage} alt="Product" className="w-full rounded-lg object-contain max-h-60" />
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
              💡 营销图生成需配置 remove.bg + Replicate API Key。配置后在本地运行 <code className="bg-blue-100 px-1 rounded">python image-gen/generate.py</code>
            </div>
          </div>

          {/* 右侧：AI 生成的产品信息 */}
          <div className="bg-white rounded-xl border border-brand-copper/30 p-5 space-y-3 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold text-gray-700">✨ AI 生成的产品信息</span>
              <span className="text-[10px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded">可编辑</span>
            </div>

            {/* 产品名 */}
            <EditField label="产品名" value={editedInfo.name} onChange={(v) => setEditedInfo({ ...editedInfo, name: v })} />

            {/* Slogan */}
            <EditField label="一句话卖点" value={editedInfo.tagline} onChange={(v) => setEditedInfo({ ...editedInfo, tagline: v })} />

            {/* 分类 + 售价 */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-gray-400 mb-0.5">分类</label>
                <select value={editedInfo.category} onChange={(e) => setEditedInfo({ ...editedInfo, category: e.target.value })} className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs">
                  {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <EditField label="售价 USD" value={String(editedInfo.suggestedPrice)} onChange={(v) => setEditedInfo({ ...editedInfo, suggestedPrice: Number(v) || 0 })} type="number" />
            </div>

            {/* 产品特点 */}
            <div>
              <label className="block text-[10px] text-gray-400 mb-1">产品特点 (Features)</label>
              {editedInfo.features.map((f, i) => (
                <div key={i} className="flex items-center gap-1 mb-1">
                  <input value={f} onChange={(e) => { const arr = [...editedInfo.features]; arr[i] = e.target.value; setEditedInfo({ ...editedInfo, features: arr }); }} className="flex-1 px-2 py-1 border border-gray-200 rounded text-xs" />
                  <button onClick={() => setEditedInfo({ ...editedInfo, features: editedInfo.features.filter((_, j) => j !== i) })} className="text-red-400 text-xs px-1">✕</button>
                </div>
              ))}
              <button onClick={() => setEditedInfo({ ...editedInfo, features: [...editedInfo.features, ""] })} className="text-xs text-brand-copper hover:underline">+ 添加特点</button>
            </div>

            {/* 长描述 */}
            <div>
              <label className="block text-[10px] text-gray-400 mb-1">长描述</label>
              <textarea value={editedInfo.description} onChange={(e) => setEditedInfo({ ...editedInfo, description: e.target.value })} rows={4} className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs resize-none" />
            </div>

            {/* 材质/尺寸 */}
            <div className="grid grid-cols-2 gap-2">
              <EditField label="材质" value={editedInfo.specs?.material || ""} onChange={(v) => setEditedInfo({ ...editedInfo, specs: { ...editedInfo.specs, material: v } })} />
              <EditField label="尺寸" value={editedInfo.specs?.dimensions || ""} onChange={(v) => setEditedInfo({ ...editedInfo, specs: { ...editedInfo.specs, dimensions: v } })} />
            </div>

            {/* 颜色 */}
            <div>
              <label className="block text-[10px] text-gray-400 mb-1">可选颜色</label>
              <div className="flex flex-wrap gap-2">
                {editedInfo.colors.map((c, i) => (
                  <div key={i} className="flex items-center gap-1 text-xs">
                    <span className="w-4 h-4 rounded-full border border-gray-300 inline-block" style={{ backgroundColor: c.hex }} />
                    <input value={c.name} onChange={(e) => { const arr = [...editedInfo.colors]; arr[i] = { ...arr[i], name: e.target.value }; setEditedInfo({ ...editedInfo, colors: arr }); }} className="w-24 px-1 py-0.5 border border-gray-200 rounded text-xs" />
                  </div>
                ))}
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3 pt-3 border-t border-gray-200">
              <button onClick={handleReset} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg">← 取消</button>
              <button onClick={handlePublish} disabled={publishing} className="flex-1 py-2.5 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50">
                {publishing ? "发布中..." : "🚀 一键上架"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== 完成 ===== */}
      {step === "done" && (
        <div className="bg-white rounded-xl border border-green-300 p-8 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h3 className="text-lg font-semibold text-green-700 mb-2">产品已成功上架！</h3>
          <p className="text-sm text-gray-500 mb-4">
            {editedInfo?.name} — ${editedInfo?.suggestedPrice.toFixed(2)}
          </p>
          <button onClick={handleReset} className="px-6 py-2.5 bg-brand-copper text-white rounded-lg font-medium hover:bg-brand-copper/80 transition-colors">
            + 继续添加产品
          </button>
        </div>
      )}

      {/* ===== 铺货队列 ===== */}
      {queue.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">📋 铺货队列（{queue.length}）</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {queue.map((item) => (
              <div key={item.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-700">{item.englishName || "未命名"}</span>
                  <span className="text-xs text-gray-400 ml-2">${item.retailPriceUSD.toFixed(2)}</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                  item.status === "published" ? "bg-green-100 text-green-600" :
                  item.status === "approved" ? "bg-brand-copper/10 text-brand-copper" :
                  "bg-gray-100 text-gray-500"
                }`}>
                  {item.status === "published" ? "已上架" : item.status === "approved" ? "已审批" : "草稿"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** 可编辑字段小组件 */
function EditField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-[10px] text-gray-400 mb-0.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs focus:ring-1 focus:ring-brand-copper/30 focus:outline-none"
      />
    </div>
  );
}
