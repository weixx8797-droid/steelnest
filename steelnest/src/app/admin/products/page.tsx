"use client";

/**
 * 产品管理页面
 * 查看产品列表、编辑产品信息、上架/下架
 */

import { useState, useEffect, useRef } from "react";
import type { Product } from "@/data/products";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 新增产品表单状态
  const [creating, setCreating] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    englishName: "",
    category: "desk" as Product["category"],
    price: 0,
    originalPrice: undefined as number | undefined,
    tagline: "",
    description: "",
    featuresText: "",
    specs: { material: "", dimensions: "", weightCapacity: "", weight: "" },
    images: [] as string[],
  });
  const [newImageUrl, setNewImageUrl] = useState("");
  const newFileInputRef = useRef<HTMLInputElement>(null);

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
        const data = await res.json().catch(() => ({}));
        setMessage("❌ 保存失败：" + (data.error || "状态 " + res.status));
      }
    } catch {
      setMessage("❌ 网络错误");
    } finally {
      setSaving(false);
    }
  };

  // 上传图片文件 → 先传到 Blob/服务器，拿到图片 URL 再保存
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    setMessage("");
    try {
      for (const file of files) {
        if (file.size > 3 * 1024 * 1024) {
          setMessage("❌ 图片超过 3MB，请压缩后再传");
          continue;
        }
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/admin/upload-image", {
          method: "POST",
          body: form,
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setMessage("❌ 图片上传失败：" + (data.error || "状态 " + res.status));
          continue;
        }
        const url = data.url as string;
        setEditing((prev) =>
          prev ? { ...prev, images: [...prev.images, url] } : prev
        );
      }
    } catch {
      setMessage("❌ 网络错误，图片未上传");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // 添加图片 URL
  const handleAddImageUrl = () => {
    const url = imageUrlInput.trim();
    if (!url || !editing) return;
    setEditing({ ...editing, images: [...editing.images, url] });
    setImageUrlInput("");
  };

  // 删除某张图片
  const removeImage = (index: number) => {
    if (!editing) return;
    setEditing({
      ...editing,
      images: editing.images.filter((_, i) => i !== index),
    });
  };

  // 设为封面（移到第一位）
  const setAsCover = (index: number) => {
    if (!editing || index === 0) return;
    const images = [...editing.images];
    const [img] = images.splice(index, 1);
    images.unshift(img);
    setEditing({ ...editing, images });
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

  // 新增产品：上传图片 → 先传到 Blob/服务器，拿到图片 URL 再保存
  const handleNewFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    setMessage("");
    try {
      for (const file of files) {
        if (file.size > 3 * 1024 * 1024) {
          setMessage("❌ 图片超过 3MB，请压缩后再传");
          continue;
        }
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/admin/upload-image", {
          method: "POST",
          body: form,
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setMessage("❌ 图片上传失败：" + (data.error || "状态 " + res.status));
          continue;
        }
        const url = data.url as string;
        setNewProduct((prev) => ({ ...prev, images: [...prev.images, url] }));
      }
    } catch {
      setMessage("❌ 网络错误，图片未上传");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleAddNewImageUrl = () => {
    const url = newImageUrl.trim();
    if (!url) return;
    setNewProduct((prev) => ({ ...prev, images: [...prev.images, url] }));
    setNewImageUrl("");
  };

  const removeNewImage = (index: number) => {
    setNewProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleCreate = async () => {
    if (!newProduct.name.trim()) {
      setMessage("❌ 请填写产品名");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      const features = newProduct.featuresText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newProduct.name.trim(),
          englishName: newProduct.englishName.trim() || undefined,
          category: newProduct.category,
          price: newProduct.price,
          originalPrice: newProduct.originalPrice || undefined,
          tagline: newProduct.tagline,
          description: newProduct.description,
          features,
          specs: newProduct.specs,
          images: newProduct.images,
        }),
      });

      if (res.ok) {
        setMessage("✅ 新增成功，已上架");
        setCreating(false);
        setNewProduct({
          name: "",
          englishName: "",
          category: "desk",
          price: 0,
          originalPrice: undefined,
          tagline: "",
          description: "",
          featuresText: "",
          specs: { material: "", dimensions: "", weightCapacity: "", weight: "" },
          images: [],
        });
        loadProducts();
      } else {
        const data = await res.json().catch(() => ({}));
        setMessage("❌ 新增失败：" + (data.error || `状态 ${res.status}`));
      }
    } catch {
      setMessage("❌ 网络错误");
    } finally {
      setSaving(false);
    }
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
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{products.length} 款产品</span>
          <button
            onClick={() => setCreating(true)}
            className="px-4 py-2 text-sm bg-brand-charcoal text-white rounded hover:bg-brand-copper transition-colors"
          >
            ＋ 新增产品
          </button>
        </div>
      </div>

      {(message || uploading) && (
        <div className="text-sm px-3 py-2 bg-gray-50 border border-gray-200 rounded">
          {uploading ? "图片上传中..." : message}
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

      {/* 新增产品弹窗 */}
      {creating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[85vh] overflow-y-auto">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">新增产品</h3>
              <button
                onClick={() => setCreating(false)}
                className="text-gray-400 hover:text-gray-600 text-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* 产品名 */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  产品名 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  placeholder="例如：三层不锈钢置物架"
                  className="w-full px-3 py-2 border border-gray-200 rounded text-sm"
                />
              </div>

              {/* 英文名（URL） */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  英文名 / URL 标识（可选，用于网址，建议英文）
                </label>
                <input
                  type="text"
                  value={newProduct.englishName}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, englishName: e.target.value })
                  }
                  placeholder="例如：3-tier-steel-shelf"
                  className="w-full px-3 py-2 border border-gray-200 rounded text-sm"
                />
              </div>

              {/* 分类 */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  分类
                </label>
                <select
                  value={newProduct.category}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      category: e.target.value as Product["category"],
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded text-sm bg-white"
                >
                  <option value="desk">Desk &amp; Counter（桌面/台面）</option>
                  <option value="storage">Storage（收纳）</option>
                  <option value="bathroom">Bathroom（浴室）</option>
                </select>
              </div>

              {/* 价格 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    售价 (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    原价（划线，可选）
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.originalPrice || ""}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        originalPrice: e.target.value
                          ? parseFloat(e.target.value)
                          : undefined,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded text-sm"
                  />
                </div>
              </div>

              {/* 图片 */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  产品图片（第一张为主图）
                </label>
                {newProduct.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {newProduct.images.map((img, i) => (
                      <div
                        key={i}
                        className="relative aspect-square rounded border border-gray-200 overflow-hidden group"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img}
                          alt={`图片 ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(i)}
                          className="absolute bottom-0 inset-x-0 bg-black/60 text-red-300 text-[10px] py-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          删除
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <input
                  ref={newFileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleNewFileUpload}
                      disabled={uploading}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => newFileInputRef.current?.click()}
                  className="w-full px-3 py-2 text-sm border border-dashed border-gray-300 rounded text-gray-500 hover:border-brand-copper hover:text-brand-copper transition-colors"
                >
                  📤 上传图片（可多选）
                </button>
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="或粘贴图片 URL 链接"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddNewImageUrl();
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddNewImageUrl}
                    className="px-3 py-2 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                  >
                    添加
                  </button>
                </div>
              </div>

              {/* 规格参数 */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  规格参数
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-0.5">材质 (material)</label>
                    <input
                      type="text"
                      value={newProduct.specs.material}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          specs: { ...newProduct.specs, material: e.target.value },
                        })
                      }
                      placeholder="例如：Reinforced Cold-Rolled Steel"
                      className="w-full px-3 py-2 border border-gray-200 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-0.5">尺寸 (dimensions)</label>
                    <input
                      type="text"
                      value={newProduct.specs.dimensions}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          specs: { ...newProduct.specs, dimensions: e.target.value },
                        })
                      }
                      placeholder="例如：32 x 22 x 28 cm"
                      className="w-full px-3 py-2 border border-gray-200 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-0.5">承重 (weight Capacity)</label>
                    <input
                      type="text"
                      value={newProduct.specs.weightCapacity}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          specs: { ...newProduct.specs, weightCapacity: e.target.value },
                        })
                      }
                      placeholder="例如：12 kg per tier"
                      className="w-full px-3 py-2 border border-gray-200 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-0.5">重量 (weight, 可选)</label>
                    <input
                      type="text"
                      value={newProduct.specs.weight || ""}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          specs: { ...newProduct.specs, weight: e.target.value },
                        })
                      }
                      placeholder="例如：1.8 kg"
                      className="w-full px-3 py-2 border border-gray-200 rounded text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* 一句话卖点 */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  一句话卖点 (tagline)
                </label>
                <input
                  type="text"
                  value={newProduct.tagline}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, tagline: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded text-sm"
                />
              </div>

              {/* 长描述 */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  长描述 (description)
                </label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded text-sm"
                />
              </div>

              {/* 卖点列表 */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  卖点列表（每行一条）
                </label>
                <textarea
                  value={newProduct.featuresText}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      featuresText: e.target.value,
                    })
                  }
                  rows={3}
                  placeholder={"✓ 加厚冷轧钢，承重更强\n✓ 免打孔安装\n✓ 可回收环保材质"}
                  className="w-full px-3 py-2 border border-gray-200 rounded text-sm"
                />
              </div>
            </div>

            <div className="px-5 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setCreating(false)}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
              >
                取消
              </button>
              <button
                onClick={handleCreate}
                disabled={saving}
                className="px-5 py-2 bg-brand-charcoal text-white rounded text-sm hover:bg-brand-copper transition-colors disabled:opacity-50"
              >
                {saving ? "创建中..." : "创建并上架"}
              </button>
            </div>
          </div>
        </div>
      )}

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

              {/* 产品图片 */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  产品图片（第一张为主图）
                </label>

                {/* 缩略图网格 */}
                {editing.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {editing.images.map((img, i) => (
                      <div
                        key={i}
                        className="relative aspect-square rounded border border-gray-200 overflow-hidden group"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img}
                          alt={`图片 ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {i === 0 && (
                          <span className="absolute top-1 left-1 text-[10px] bg-brand-copper text-white px-1 py-0.5 rounded">
                            主图
                          </span>
                        )}
                        <div className="absolute bottom-0 inset-x-0 flex justify-between items-center bg-black/60 px-1 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {i !== 0 && (
                            <button
                              type="button"
                              onClick={() => setAsCover(i)}
                              className="text-[10px] text-white hover:text-brand-copper"
                            >
                              设为主图
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(i)}
                            className="text-[10px] text-red-300 hover:text-red-500"
                          >
                            删除
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-2">
                  {/* 上传按钮 */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                      disabled={uploading}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full px-3 py-2 text-sm border border-dashed border-gray-300 rounded text-gray-500 hover:border-brand-copper hover:text-brand-copper transition-colors"
                  >
                    📤 上传图片（可多选）
                  </button>

                  {/* URL 添加 */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="或粘贴图片 URL 链接"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddImageUrl();
                        }
                      }}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-3 py-2 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                    >
                      添加
                    </button>
                  </div>
                </div>
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

              {/* 规格参数 */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  规格参数
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-0.5">材质 (material)</label>
                    <input
                      type="text"
                      value={editing.specs?.material || ""}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          specs: { ...editing.specs, material: e.target.value },
                        })
                      }
                      placeholder="例如：Reinforced Cold-Rolled Steel"
                      className="w-full px-3 py-2 border border-gray-200 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-0.5">尺寸 (dimensions)</label>
                    <input
                      type="text"
                      value={editing.specs?.dimensions || ""}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          specs: { ...editing.specs, dimensions: e.target.value },
                        })
                      }
                      placeholder="例如：32 x 22 x 28 cm"
                      className="w-full px-3 py-2 border border-gray-200 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-0.5">承重 (weight Capacity)</label>
                    <input
                      type="text"
                      value={editing.specs?.weightCapacity || ""}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          specs: { ...editing.specs, weightCapacity: e.target.value },
                        })
                      }
                      placeholder="例如：12 kg per tier"
                      className="w-full px-3 py-2 border border-gray-200 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-0.5">重量 (weight, 可选)</label>
                    <input
                      type="text"
                      value={editing.specs?.weight || ""}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          specs: { ...editing.specs, weight: e.target.value },
                        })
                      }
                      placeholder="例如：1.8 kg"
                      className="w-full px-3 py-2 border border-gray-200 rounded text-sm"
                    />
                  </div>
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
