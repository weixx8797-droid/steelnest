"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/data/products";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState(product.colors[0].name);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product, 1, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* 颜色选择 */}
      <div className="space-y-2">
        <span className="text-sm font-semibold text-brand-charcoal">
          Color:{" "}
          <span className="text-brand-steel font-normal">{selectedColor}</span>
        </span>
        <div className="flex gap-2">
          {product.colors.map((color) => (
            <button
              key={color.name}
              onClick={() => setSelectedColor(color.name)}
              className={`w-10 h-10 rounded-full border-2 transition-all ${
                selectedColor === color.name
                  ? "border-brand-copper scale-110 shadow-md"
                  : "border-gray-200 hover:border-brand-copper"
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* 加购按钮 */}
      <button
        onClick={handleAdd}
        className={`w-full md:w-auto inline-flex items-center justify-center px-10 py-3.5 font-semibold rounded-md transition-all text-sm tracking-wide ${
          added
            ? "bg-brand-leaf text-white"
            : "bg-brand-copper text-white hover:bg-[#B8953E]"
        }`}
      >
        {added ? "✓ Added to Cart!" : `Add to Cart — $${product.price}`}
      </button>
    </div>
  );
}
