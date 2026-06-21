/**
 * GET /api/admin/products — 获取产品列表
 * PUT /api/admin/products — 更新产品信息
 */

import { NextResponse } from "next/server";
import { getAllProducts, getProductBySlug, products, type Product } from "@/data/products";

export async function GET() {
  const allProducts = getAllProducts();
  return NextResponse.json(allProducts);
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { slug, ...updates } = body;

    if (!slug) {
      return NextResponse.json({ error: "缺少 slug" }, { status: 400 });
    }

    const product = getProductBySlug(slug);
    if (!product) {
      return NextResponse.json({ error: "产品不存在" }, { status: 404 });
    }

    // 更新产品字段（仅允许修改部分字段）
    const allowedFields = [
      "name", "tagline", "price", "originalPrice", "category",
      "inStock", "isNew", "isBestseller", "discount",
      "description", "features", "specs", "images", "colors",
    ];

    for (const key of allowedFields) {
      if (key in updates) {
        (product as Record<string, unknown>)[key] = updates[key];
      }
    }

    return NextResponse.json({ ok: true, product });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "更新失败" },
      { status: 500 }
    );
  }
}
