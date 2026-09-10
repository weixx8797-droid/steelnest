/**
 * LabOrigin 产品数据库（培育钻石库存）
 * 数据源：
 *  - 线上（Vercel）：Vercel Blob 存储，路径 "products.json"（需要环境变量 BLOB_READ_WRITE_TOKEN）
 *  - 本地开发：src/data/products.json（无 token 时自动回退到本地文件）
 * 新增库存：在后台创建，或直接编辑 products.json 添加一个对象
 * 产品图片：放在 public/products/ 文件夹，引用路径 /products/xxx.jpg；也可使用外链 URL 或 base64 data URL
 */

import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { get, put } from "@vercel/blob";
import defaultCatalog from "./products.json";

/** 钻石切型（同时作为 category 使用） */
export type DiamondShape =
  | "round"
  | "princess"
  | "oval"
  | "emerald"
  | "cushion"
  | "pear"
  | "marquise"
  | "radiant";

/** 裸钻规格 */
export interface DiamondSpecs {
  shape: string; // 切型描述，如 "Round Brilliant"
  carat: string; // 克拉重量，如 "1.00 ct"
  color: string; // 颜色等级，如 "D"
  clarity: string; // 净度等级，如 "VVS1"
  cut: string; // 切工，如 "Excellent"
  certificate: string; // 证书，如 "IGI LG6204xxxxx"
  polish?: string; // 抛光
  symmetry?: string; // 对称性
  fluorescence?: string; // 荧光
}

export interface Product {
  slug: string; // URL 用的唯一标识（英文短横线）
  name: string;
  tagline: string;
  price: number; // 指示价（美元），最终以询价为准
  originalPrice?: number; // 划线原价（有打折时用）
  category: DiamondShape; // 切型
  images: string[]; // 产品图片路径，第一张是主图
  specs: DiamondSpecs; // 裸钻规格
  features: string[]; // 卖点列表
  description: string; // 长描述
  inStock: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  discount?: string; // 标签文字，如 "NEW"
}

const PRODUCTS_FILE = path.join(process.cwd(), "src/data/products.json");
const BLOB_PATH = "products.json";

// 线上（Vercel）通过 BLOB_READ_WRITE_TOKEN 自动启用 Blob；本地开发没有该变量则回退到本地文件
const BLOB_ENABLED = !!process.env.BLOB_READ_WRITE_TOKEN;

/** 从本地 JSON 文件读取产品列表 */
function readFromFile(): Product[] {
  try {
    const raw = readFileSync(PRODUCTS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** 从 Vercel Blob 读取产品列表；Blob 为空（首次上线）或读取失败时回退到打包的本地文件 */
async function readFromBlob(): Promise<Product[]> {
  try {
    const result = await get(BLOB_PATH, { access: "private" });
    if (!result || result.statusCode !== 200) return readFromFile();
    const text = await new Response(result.stream).text();
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : readFromFile();
  } catch {
    return readFromFile();
  }
}

/** 读取产品列表（Blob 优先，本地文件回退） */
async function readProducts(): Promise<Product[]> {
  return BLOB_ENABLED ? readFromBlob() : readFromFile();
}

/** 将产品列表写回存储（后台编辑用） */
export async function writeProducts(products: Product[]): Promise<void> {
  const json = JSON.stringify(products, null, 2);
  if (BLOB_ENABLED) {
    await put(BLOB_PATH, json, {
      access: "private",
      contentType: "application/json",
      allowOverwrite: true,
    });
  } else {
    writeFileSync(PRODUCTS_FILE, json, "utf-8");
  }
}

/** 获取所有产品 */
export async function getAllProducts(): Promise<Product[]> {
  return readProducts();
}

/**
 * 打包时固化的默认钻石库存。
 * 用于后台「恢复默认库存」：线上库存存在 Blob 里，改版前的旧品类数据
 * 不会被代码更新覆盖，需要一次性重置。返回深拷贝，避免调用方改动模块缓存。
 */
export function getDefaultProducts(): Product[] {
  return JSON.parse(JSON.stringify(defaultCatalog)) as Product[];
}

/** 根据 slug 获取单个产品 */
export async function getProductBySlug(
  slug: string
): Promise<Product | undefined> {
  return (await readProducts()).find((p) => p.slug === slug);
}

/** 按切型筛选产品 */
export async function getProductsByCategory(
  category: DiamondShape
): Promise<Product[]> {
  return (await readProducts()).filter((p) => p.category === category);
}

/** 获取推荐/精选产品 */
export async function getFeaturedProducts(): Promise<Product[]> {
  return (await readProducts())
    .filter((p) => p.isBestseller || p.isNew)
    .slice(0, 4);
}
