"use client";

/**
 * 产品图片画廊
 * 点击下方缩略图切换上方大图，第一张默认展示
 * 兼容本地路径、base64 data URL、外链 URL 三种图片来源
 */

import { useState } from "react";

interface ProductGalleryProps {
  images: string[];
  name: string;
  discount?: string;
}

export default function ProductGallery({
  images,
  name,
  discount,
}: ProductGalleryProps) {
  const [active, setActive] = useState(0);

  if (images.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* 主图 */}
      <div className="relative aspect-square bg-brand-light rounded-xl overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[active]}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {discount && (
          <span
            className={`absolute top-4 left-4 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded ${
              discount === "NEW"
                ? "bg-brand-leaf text-white"
                : "bg-brand-copper text-white"
            }`}
          >
            {discount}
          </span>
        )}
      </div>

      {/* 缩略图列表（仅多图时显示） */}
      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`查看第 ${i + 1} 张图片`}
              className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors cursor-pointer ${
                i === active
                  ? "border-brand-copper"
                  : "border-gray-200 hover:border-brand-copper"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt={`${name} view ${i + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
