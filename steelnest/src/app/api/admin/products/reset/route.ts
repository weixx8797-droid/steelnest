/**
 * POST /api/admin/products/reset — 用打包的默认钻石库存覆盖当前库存
 *
 * 背景：线上库存存在 Vercel Blob，代码里的 products.json 只在 Blob 为空时
 * 才作为回退。品牌转型后 Blob 里仍是旧品类商品，前台会一直展示旧货。
 * 这个接口用于一次性重置，重置后可在后台继续正常增删改。
 */

import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getDefaultProducts, writeProducts } from "@/data/products";

export async function POST() {
  const authed = await isAdminAuthenticated();
  if (!authed) return NextResponse.json({ error: "未登录" }, { status: 401 });

  try {
    const defaults = getDefaultProducts();
    if (defaults.length === 0) {
      return NextResponse.json(
        { error: "默认库存为空，已中止以避免清空现有数据" },
        { status: 400 }
      );
    }

    await writeProducts(defaults);
    return NextResponse.json({ ok: true, count: defaults.length });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "重置失败" },
      { status: 500 }
    );
  }
}
