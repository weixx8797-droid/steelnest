"use client";

/**
 * 订单管理页面
 * 统计概览 → 状态筛选 → 订单列表 → 展开详情 → 复制地址/标记采购/回填单号/标记发货/删除
 */

import { useState, useEffect, useMemo } from "react";
import type { Order } from "@/lib/orders";

const STATUS_LABEL: Record<Order["status"], string> = {
  pending: "待处理",
  purchasing: "采购中",
  purchased: "已采购",
  shipped: "已发货",
  delivered: "已完成",
};

const STATUS_STYLE: Record<Order["status"], string> = {
  pending: "bg-yellow-100 text-yellow-700",
  purchasing: "bg-blue-100 text-blue-700",
  purchased: "bg-purple-100 text-purple-700",
  shipped: "bg-green-100 text-green-700",
  delivered: "bg-gray-100 text-gray-600",
};

type Filter = "all" | Order["status"];

const FILTER_TABS: { value: Filter; label: string }[] = [
  { value: "all", label: "全部" },
  { value: "pending", label: "待处理" },
  { value: "purchasing", label: "采购中" },
  { value: "purchased", label: "已采购" },
  { value: "shipped", label: "已发货" },
  { value: "delivered", label: "已完成" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<Order | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const loadOrders = () => {
    setLoading(true);
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then(setOrders)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // 统计数据
  const stats = useMemo(() => {
    const totalSales = orders.reduce((s, o) => s + o.total, 0);
    const count = (s: Order["status"]) => orders.filter((o) => o.status === s).length;
    return {
      total: orders.length,
      totalSales,
      pending: count("pending") + count("purchasing"),
      shipped: count("shipped"),
    };
  }, [orders]);

  const filteredOrders = useMemo(
    () => (filter === "all" ? orders : orders.filter((o) => o.status === filter)),
    [orders, filter]
  );

  // 更新订单（PUT）
  const updateOrder = async (orderNumber: string, patch: Partial<Order>) => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber, ...patch }),
      });
      if (res.ok) {
        const data = await res.json();
        setSelected(data.order);
        loadOrders();
        setMessage("✅ 已保存");
      } else {
        const err = await res.json().catch(() => ({}));
        setMessage("❌ " + (err.error || "保存失败"));
      }
    } catch {
      setMessage("❌ 网络错误");
    } finally {
      setSaving(false);
    }
  };

  // 删除订单
  const handleDelete = async () => {
    if (!selected) return;
    if (!window.confirm(`确定删除订单 ${selected.orderNumber}？此操作不可恢复。`)) return;

    setSaving(true);
    try {
      const res = await fetch(
        `/api/admin/orders?orderNumber=${encodeURIComponent(selected.orderNumber)}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setSelected(null);
        loadOrders();
      } else {
        const err = await res.json().catch(() => ({}));
        setMessage("❌ " + (err.error || "删除失败"));
      }
    } catch {
      setMessage("❌ 网络错误");
    } finally {
      setSaving(false);
    }
  };

  // 复制收货地址（方便去 1688 下单时粘贴）
  const formatAddress = (o: Order): string => {
    const a = o.shippingAddress;
    const lines = [
      a.name,
      a.line1 + (a.line2 ? ", " + a.line2 : ""),
      [a.city, a.state, a.postalCode].filter(Boolean).join(", "),
      a.country,
      a.phone ? `Phone: ${a.phone}` : "",
    ].filter(Boolean);
    return lines.join("\n");
  };

  const copyAddress = async () => {
    if (!selected) return;
    try {
      await navigator.clipboard.writeText(formatAddress(selected));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setMessage("❌ 复制失败，请手动选择复制");
    }
  };

  // 更新弹窗里订单的字段
  const patchSelected = (patch: Partial<Order>) => {
    setSelected((prev) => (prev ? { ...prev, ...patch } : prev));
  };

  const patchSourcing = (patch: Partial<Order["sourcing"]>) => {
    setSelected((prev) =>
      prev ? { ...prev, sourcing: { ...prev.sourcing, ...patch } } : prev
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">订单管理</h1>
        <p className="text-sm text-gray-500">加载中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">订单管理</h1>
        <span className="text-sm text-gray-500">共 {orders.length} 笔订单</span>
      </div>

      {/* ===== 统计卡片 ===== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="总订单" value={String(stats.total)} icon="📦" />
        <StatCard label="总销售额" value={`$${stats.totalSales.toFixed(2)}`} icon="💰" />
        <StatCard label="待处理" value={String(stats.pending)} icon="⏳" accent />
        <StatCard label="已发货" value={String(stats.shipped)} icon="🚚" />
      </div>

      {/* ===== 状态筛选 ===== */}
      <div className="flex flex-wrap gap-2">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
              filter === tab.value
                ? "bg-brand-charcoal text-white border-brand-charcoal"
                : "bg-white text-gray-600 border-gray-200 hover:border-brand-copper"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="text-4xl mb-3">📦</div>
          <p className="text-gray-500 text-sm">
            {orders.length === 0 ? "暂无订单" : "该状态下暂无订单"}
          </p>
          {orders.length === 0 && (
            <p className="text-gray-400 text-xs mt-1">
              顾客下单后订单会显示在这里（本地可用信用卡按钮模拟下单）
            </p>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 uppercase tracking-wider bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3">订单号</th>
                  <th className="px-4 py-3">客户</th>
                  <th className="px-4 py-3">商品</th>
                  <th className="px-4 py-3">金额</th>
                  <th className="px-4 py-3">状态</th>
                  <th className="px-4 py-3">日期</th>
                  <th className="px-4 py-3">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">
                      {order.orderNumber}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {order.customerEmail}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {order.items.map((i) => i.productName).join(", ")}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-700">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${STATUS_STYLE[order.status]}`}
                      >
                        {STATUS_LABEL[order.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {order.createdAt?.slice(0, 10) || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          setSelected(order);
                          setMessage("");
                          setCopied(false);
                        }}
                        className="text-xs text-brand-copper hover:underline"
                      >
                        处理
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===== 订单处理弹窗 ===== */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[85vh] overflow-y-auto">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-gray-800">
                  {selected.orderNumber}
                </h3>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${STATUS_STYLE[selected.status]}`}
                >
                  {STATUS_LABEL[selected.status]}
                </span>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-gray-600 text-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-6">
              {message && (
                <div className="text-sm px-3 py-2 bg-gray-50 border border-gray-200 rounded">
                  {message}
                </div>
              )}

              {/* 收货地址 */}
              <section>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    收货地址
                  </h4>
                  <button
                    onClick={copyAddress}
                    className={`text-xs px-3 py-1 rounded border transition-colors ${
                      copied
                        ? "bg-green-50 text-green-600 border-green-200"
                        : "text-brand-copper border-gray-200 hover:border-brand-copper"
                    }`}
                  >
                    {copied ? "✓ 已复制" : "📋 复制地址"}
                  </button>
                </div>
                <div className="text-sm text-gray-700 leading-relaxed">
                  <p className="font-medium">{selected.shippingAddress.name}</p>
                  <p>
                    {selected.shippingAddress.line1}
                    {selected.shippingAddress.line2
                      ? ", " + selected.shippingAddress.line2
                      : ""}
                  </p>
                  <p>
                    {selected.shippingAddress.city}
                    {selected.shippingAddress.state
                      ? ", " + selected.shippingAddress.state
                      : ""}{" "}
                    {selected.shippingAddress.postalCode}
                  </p>
                  <p>
                    {selected.shippingAddress.country}
                    {selected.shippingAddress.phone
                      ? " · " + selected.shippingAddress.phone
                      : ""}
                  </p>
                </div>
              </section>

              {/* 商品明细 */}
              <section>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  商品明细
                </h4>
                <div className="divide-y divide-gray-50">
                  {selected.items.map((item, i) => (
                    <div
                      key={i}
                      className="py-2 flex justify-between text-sm text-gray-700"
                    >
                      <span>
                        {item.productName}
                        <span className="text-gray-400"> · {item.color}</span>{" "}
                        × {item.quantity}
                      </span>
                      <span className="font-medium">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-3 mt-2 border-t border-gray-100 space-y-1 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span>${selected.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Shipping</span>
                    <span>${selected.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-gray-800 pt-1">
                    <span>Total</span>
                    <span>${selected.total.toFixed(2)}</span>
                  </div>
                </div>
              </section>

              {/* 采购记录 */}
              <section>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  采购记录
                </h4>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <input
                    type="text"
                    placeholder="供应商（如 1688 店铺名）"
                    value={selected.sourcing.supplierName || ""}
                    onChange={(e) =>
                      patchSourcing({ supplierName: e.target.value })
                    }
                    className="px-3 py-2 border border-gray-200 rounded text-sm"
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="采购成本 (USD)"
                    value={selected.sourcing.cost ?? ""}
                    onChange={(e) =>
                      patchSourcing({
                        cost: e.target.value ? parseFloat(e.target.value) : undefined,
                      })
                    }
                    className="px-3 py-2 border border-gray-200 rounded text-sm"
                  />
                </div>
                <input
                  type="text"
                  placeholder="备注（如采购单号、1688 订单号）"
                  value={selected.sourcing.note || ""}
                  onChange={(e) => patchSourcing({ note: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded text-sm mb-3"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      updateOrder(selected.orderNumber, {
                        sourcing: { ...selected.sourcing, status: "ordered" },
                        status: "purchasing",
                      })
                    }
                    disabled={saving}
                    className="px-4 py-2 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors disabled:opacity-50"
                  >
                    保存采购（采购中）
                  </button>
                  <button
                    onClick={() =>
                      updateOrder(selected.orderNumber, {
                        sourcing: { ...selected.sourcing, status: "received" },
                        status: "purchased",
                      })
                    }
                    disabled={saving}
                    className="px-4 py-2 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
                  >
                    标记采购完成
                  </button>
                </div>
              </section>

              {/* 发货 */}
              <section>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  发货
                </h4>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <input
                    type="text"
                    placeholder="承运商（如 USPS / YunExpress）"
                    value={selected.carrier || ""}
                    onChange={(e) => patchSelected({ carrier: e.target.value })}
                    className="px-3 py-2 border border-gray-200 rounded text-sm"
                  />
                  <input
                    type="text"
                    placeholder="物流单号 (Tracking Number)"
                    value={selected.trackingNumber || ""}
                    onChange={(e) =>
                      patchSelected({ trackingNumber: e.target.value })
                    }
                    className="px-3 py-2 border border-gray-200 rounded text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      updateOrder(selected.orderNumber, {
                        carrier: selected.carrier,
                        trackingNumber: selected.trackingNumber,
                        status: "shipped",
                      })
                    }
                    disabled={saving}
                    className="px-5 py-2 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    {saving ? "处理中..." : "📦 标记发货（通知客户）"}
                  </button>
                  {selected.status === "shipped" && (
                    <button
                      onClick={() =>
                        updateOrder(selected.orderNumber, { status: "delivered" })
                      }
                      disabled={saving}
                      className="px-5 py-2 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                      标记完成
                    </button>
                  )}
                </div>
              </section>

              {/* 删除 */}
              <section className="border-t border-gray-100 pt-4">
                <button
                  onClick={handleDelete}
                  disabled={saving}
                  className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50"
                >
                  🗑 删除订单
                </button>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** 统计卡片 */
function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: string;
  icon: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`bg-white rounded-lg border p-4 flex items-center gap-3 ${
        accent ? "border-brand-copper/40" : "border-gray-200"
      }`}
    >
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-lg font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}
