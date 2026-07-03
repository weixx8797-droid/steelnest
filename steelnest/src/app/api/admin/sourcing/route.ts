/**
 * GET /api/admin/sourcing — 获取铺货队列
 * POST /api/admin/sourcing — 添加产品到铺货队列
 * PUT /api/admin/sourcing — 更新铺货产品（审批、定价等）
 */

import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import fs from "fs";
import path from "path";

const QUEUE_FILE = path.join(process.cwd(), "src/data/sourcing-queue.json");

function readQueue() {
  try {
    return JSON.parse(fs.readFileSync(QUEUE_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function writeQueue(queue: unknown[]) {
  fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2), "utf-8");
}

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function GET() {
  const queue = readQueue();
  return NextResponse.json(queue);
}

export async function POST(request: Request) {
  const authed = await isAdminAuthenticated();
  if (!authed) return NextResponse.json({ error: "未登录" }, { status: 401 });

  try {
    const body = await request.json();
    const queue = readQueue();

    const newItem = {
      id: generateId("src"),
      quoteId: body.quoteId || null,
      supplierId: body.supplierId || null,
      retailPriceUSD: body.retailPriceUSD || 0,
      englishName: body.englishName || "",
      englishDescription: body.englishDescription || "",
      tagline: body.tagline || "",
      category: body.category || "desk",
      images: body.images || [],
      marketingImages: body.marketingImages || [],
      marketingGenerated: false,
      tags: body.tags || [],
      status: "draft" as const,
      createdAt: new Date().toISOString(),
      publishedAt: null,
    };

    queue.push(newItem);
    writeQueue(queue);

    return NextResponse.json({ ok: true, item: newItem });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "添加失败" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const authed = await isAdminAuthenticated();
  if (!authed) return NextResponse.json({ error: "未登录" }, { status: 401 });

  try {
    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: "缺少 id" }, { status: 400 });

    const queue = readQueue();
    const index = queue.findIndex((q: { id: string }) => q.id === id);
    if (index === -1) return NextResponse.json({ error: "产品不存在" }, { status: 404 });

    // 允许更新的字段
    const allowed = [
      "retailPriceUSD", "englishName", "englishDescription", "tagline",
      "category", "images", "marketingImages", "marketingGenerated",
      "tags", "status", "publishedAt",
    ];
    for (const key of allowed) {
      if (key in updates) {
        queue[index][key] = updates[key];
      }
    }

    writeQueue(queue);
    return NextResponse.json({ ok: true, item: queue[index] });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "更新失败" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const authed = await isAdminAuthenticated();
  if (!authed) return NextResponse.json({ error: "未登录" }, { status: 401 });

  try {
    const { id } = await request.json();
    let queue = readQueue();
    queue = queue.filter((q: { id: string }) => q.id !== id);
    writeQueue(queue);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "删除失败" },
      { status: 500 }
    );
  }
}
