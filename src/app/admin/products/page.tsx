"use client";

/**
 * 产品管理页面
 * 查看产品列表、编辑产品信息、上架/下架
 */

import { useState, useEffect } from "react";
import type { Product } from "@/data/products";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // 加载产品列表
  const loadProducts = () => {
    setLoading(true);
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then(setProducts)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // 保存编辑
  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });

      if (res.ok) {
        setMessage("✅ 保存成功");
        setEditing(null);
        loadProducts();
      } else {
        setMessage("❌ 保存失败");
      }
    } catch {
      setMessage("❌ 网络错误");
    } finally {
      setSaving(false);
    }
  };

  // 快速切换上架状态
  const toggleStock = async (product: Product) => {
    const updated = { slug: product.slug, inStock: !product.inStock };
    await fetch("/api/admin/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    loadProducts();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">产品管理</h1>
        <p className="text-sm text-gray-500">加载中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">产品管理</h1>
        <span className="text-sm text-gray-500">{products.length} 款产品</span>
      </div>

      {message && (
        <div className="text-sm px-3 py-2 bg-gray-50 border border-gray-200 rounded">
          {message}
        </div>
      )}

      {/* 产品列表 */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 uppercase tracking-wider bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3">产品名</th>
                <th className="px-4 py-3">分类</th>
                <th className="px-4 py-3">售价 (USD)</th>
                <th className="px-4 py-3">折后价</th>
                <th className="px-4 py-3">库存</th>
                <th className="px-4 py-3">标签</th>
                <th className="px-4 py-3">操作</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.slug}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-700">
                      {product.name}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      /products/{product.slug}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded capitalize">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-700">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    {product.originalPrice ? (
                      <span className="text-red-500 line-through text-xs">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-gray-300">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleStock(product)}
                      className={`text-xs px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
                        product.inStock
                          ? "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700"
                          : "bg-red-100 text-red-700 hover:bg-green-100 hover:text-green-700"
                      }`}
                      title="点击切换上下架"
                    >
                      {product.inStock ? "在售" : "下架"}
                    </button>
                  </td>
                  <td className="px-4 py-3 space-x-1">
                    {product.isNew && (
                      <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">
                        NEW
                      </span>
                    )}
                    {product.isBestseller && (
                      <span className="text-[10px] bg-copper/10 text-brand-copper px-1.5 py-0.5 rounded">
                        BEST
                      </span>
                    )}
                    {product.discount && product.discount !== "NEW" && (
                      <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
                        {product.discount}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setEditing({ ...product })}
                      className="text-xs text-brand-copper hover:underline"
                    >
                      编辑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 编辑弹窗 */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">编辑产品</h3>
              <button
                onClick={() => setEditing(null)}
                className="text-gray-400 hover:text-gray-600 text-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* 产品名 */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  产品名
                </label>
                <input
                  type="text"
                  value={editing.name}
                  onChange={(e) =>
                    setEditing({ ...editing, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded text-sm"
                />
              </div>

              {/* 售价 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    售价 (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editing.price}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    原价 (划线)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editing.originalPrice || ""}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        originalPrice: e.target.value
                          ? parseFloat(e.target.value)
                          : undefined,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded text-sm"
                  />
                </div>
              </div>

              {/* 库存状态 */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-medium text-gray-500">
                  库存状态
                </label>
                <button
                  onClick={() =>
                    setEditing({ ...editing, inStock: !editing.inStock })
                  }
                  className={`text-xs px-3 py-1 rounded-full cursor-pointer ${
                    editing.inStock
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {editing.inStock ? "在售" : "下架"}
                </button>
              </div>

              {/* 短描述 */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  一句话卖点 (tagline)
                </label>
                <input
                  type="text"
                  value={editing.tagline}
                  onChange={(e) =>
                    setEditing({ ...editing, tagline: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded text-sm"
                />
              </div>
            </div>

            <div className="px-5 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setEditing(null)}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 bg-brand-charcoal text-white rounded text-sm hover:bg-brand-copper transition-colors disabled:opacity-50"
              >
                {saving ? "保存中..." : "保存"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
