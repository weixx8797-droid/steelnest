"use client";

/**
 * 订单管理页面
 * 查看所有订单、标记发货
 */

import { useState, useEffect } from "react";

interface Order {
  id: string;
  orderNumber: string;
  customerEmail: string;
  customerName?: string;
  items: { productName: string; quantity: number; unitPrice: number }[];
  total: number;
  paymentStatus: string;
  fulfilled: boolean;
  trackingNumber?: string;
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">订单管理</h1>
        <p className="text-sm text-gray-500">加载中...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">订单管理</h1>
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="text-4xl mb-3">📦</div>
          <p className="text-gray-500 text-sm">暂无订单</p>
          <p className="text-gray-400 text-xs mt-1">
            当顾客在你的独立站下单后，订单会显示在这里
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">订单管理</h1>
        <span className="text-sm text-gray-500">共 {orders.length} 笔订单</span>
      </div>

      {/* 订单列表 */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 uppercase tracking-wider bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3">订单号</th>
                <th className="px-4 py-3">客户</th>
                <th className="px-4 py-3">商品</th>
                <th className="px-4 py-3">金额</th>
                <th className="px-4 py-3">支付状态</th>
                <th className="px-4 py-3">发货状态</th>
                <th className="px-4 py-3">日期</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
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
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        order.paymentStatus === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.paymentStatus === "paid" ? "已付款" : "待付款"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {order.fulfilled ? (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        已发货
                      </span>
                    ) : (
                      <button className="text-xs bg-brand-copper/10 text-brand-copper px-2 py-0.5 rounded-full hover:bg-brand-copper hover:text-white transition-colors">
                        标记发货
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {order.createdAt?.slice(0, 10) || "-"}
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
