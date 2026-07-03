/**
 * GET /api/admin/orders — 获取订单列表
 * 从 src/data/orders.json 读取
 */

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const ORDERS_FILE = path.join(process.cwd(), "src/data/orders.json");

function readOrders() {
  try {
    const raw = fs.readFileSync(ORDERS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function GET() {
  const orders = readOrders();
  return NextResponse.json(orders);
}
