/**
 * SteelNest 产品数据库
 * 数据源：src/data/products.json（后台编辑后持久化到这里）
 * 新增产品：在后台创建，或直接编辑 products.json 添加一个对象
 * 产品图片：放在 public/products/ 文件夹，引用路径 /products/xxx.jpg；也可使用外链 URL 或 base64 data URL
 */

import { readFileSync, writeFileSync } from "fs";
import path from "path";

export interface Product {
  slug: string; // URL 用的唯一标识（英文短横线）
  name: string;
  tagline: string;
  price: number; // 美元
  originalPrice?: number; // 划线原价（有打折时用）
  category: "desk" | "storage" | "bathroom";
  images: string[]; // 产品图片路径，第一张是主图
  specs: {
    material: string;
    dimensions: string;
    weightCapacity: string;
    weight?: string;
  };
  colors: { name: string; hex: string }[];
  features: string[]; // 卖点列表
  description: string; // 长描述
  inStock: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  discount?: string; // 折扣标签文字，如 "20% OFF"
}

const PRODUCTS_FILE = path.join(process.cwd(), "src/data/products.json");

/** 从 JSON 文件读取产品列表 */
function readProducts(): Product[] {
  try {
    const raw = readFileSync(PRODUCTS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** 将产品列表写回 JSON 文件（后台编辑用） */
export function writeProducts(products: Product[]): void {
  writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), "utf-8");
}

/** 获取所有产品 */
export function getAllProducts(): Product[] {
  return readProducts();
}

/** 根据 slug 获取单个产品 */
export function getProductBySlug(slug: string): Product | undefined {
  return readProducts().find((p) => p.slug === slug);
}

/** 按分类筛选产品 */
export function getProductsByCategory(
  category: "desk" | "storage" | "bathroom"
): Product[] {
  return readProducts().filter((p) => p.category === category);
}

/** 获取推荐/精选产品 */
export function getFeaturedProducts(): Product[] {
  return readProducts()
    .filter((p) => p.isBestseller || p.isNew)
    .slice(0, 4);
}
