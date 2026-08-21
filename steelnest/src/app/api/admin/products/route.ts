/**
 * GET /api/admin/products — 获取产品列表
 * POST /api/admin/products — 新建产品（写入 products.json，立即可用）
 * PUT /api/admin/products — 更新产品信息（持久化到 products.json）
 */

import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  getAllProducts,
  getProductBySlug,
  writeProducts,
  type Product,
} from "@/data/products";

export async function GET() {
  const allProducts = getAllProducts();
  return NextResponse.json(allProducts);
}

export async function POST(request: Request) {
  const authed = await isAdminAuthenticated();
  if (!authed) return NextResponse.json({ error: "未登录" }, { status: 401 });

  try {
    const body = await request.json();

    // 生成新产品的 slug
    const slug =
      body.slug ||
      body.englishName
        ?.toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .slice(0, 60) ||
      `product-${Date.now()}`;

    // 检查 slug 是否已存在
    const existing = getProductBySlug(slug);
    if (existing) {
      return NextResponse.json({ error: "产品 slug 已存在" }, { status: 409 });
    }

    // 构建新产品数据
    const newProduct: Product = {
      slug,
      name: body.name || body.englishName || "",
      tagline: body.tagline || "",
      price: body.price || body.retailPriceUSD || 0,
      originalPrice: body.originalPrice || undefined,
      category: body.category || "desk",
      images: body.images || [],
      specs: body.specs || { material: "", dimensions: "", weightCapacity: "" },
      colors: body.colors || [{ name: "Charcoal Black", hex: "#2D3436" }],
      features: body.features || [],
      description: body.description || body.englishDescription || "",
      inStock: true,
      isNew: true,
      discount: body.discount || undefined,
    };

    // 写入 products.json，立即可用
    const all = getAllProducts();
    all.push(newProduct);
    writeProducts(all);

    return NextResponse.json({ ok: true, product: newProduct });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "创建失败" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const authed = await isAdminAuthenticated();
  if (!authed) return NextResponse.json({ error: "未登录" }, { status: 401 });

  try {
    const body = await request.json();
    const { slug, ...updates } = body;

    if (!slug) return NextResponse.json({ error: "缺少 slug" }, { status: 400 });

    const all = getAllProducts();
    const product = all.find((p) => p.slug === slug);
    if (!product) return NextResponse.json({ error: "产品不存在" }, { status: 404 });

    const allowedFields = [
      "name", "tagline", "price", "originalPrice", "category",
      "inStock", "isNew", "isBestseller", "discount",
      "description", "features", "specs", "images", "colors",
    ];

    for (const key of allowedFields) {
      if (key in updates) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (product as any)[key] = updates[key];
      }
    }

    // 持久化回 products.json
    writeProducts(all);

    return NextResponse.json({ ok: true, product });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "更新失败" },
      { status: 500 }
    );
  }
}
