/**
 * 订单读写工具
 * 数据源：
 *  - 线上（Vercel）：Vercel Blob 存储，路径 "orders.json"（需要环境变量 BLOB_READ_WRITE_TOKEN）
 *  - 本地开发：src/data/orders.json（无 token 时自动回退到本地文件）
 */

import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { get, put } from "@vercel/blob";

export interface OrderItem {
  productSlug: string;
  productName: string;
  color: string;
  quantity: number;
  unitPrice: number;
}

export interface ShippingAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerEmail: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: "stripe" | "paypal";
  paymentStatus: "paid";
  status: "pending" | "purchasing" | "purchased" | "shipped" | "delivered";
  sourcing: {
    supplierName?: string;
    cost?: number;
    note?: string;
    status: "none" | "ordered" | "received";
  };
  trackingNumber?: string;
  carrier?: string;
  createdAt: string;
  updatedAt: string;
}

const ORDERS_FILE = path.join(process.cwd(), "src/data/orders.json");
const BLOB_PATH = "orders.json";

// 线上（Vercel）通过 BLOB_READ_WRITE_TOKEN 自动启用 Blob；本地开发没有该变量则回退到本地文件
const BLOB_ENABLED = !!process.env.BLOB_READ_WRITE_TOKEN;

/** 从本地 JSON 文件读取订单列表 */
function readFromFile(): Order[] {
  try {
    const raw = readFileSync(ORDERS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** 从 Vercel Blob 读取订单列表；Blob 为空（首次上线）或读取失败时回退到打包的本地文件 */
async function readFromBlob(): Promise<Order[]> {
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

/** 读取订单列表（Blob 优先，本地文件回退） */
export async function readOrders(): Promise<Order[]> {
  return BLOB_ENABLED ? readFromBlob() : readFromFile();
}

/** 将订单列表写回存储 */
async function writeOrders(orders: Order[]): Promise<void> {
  const json = JSON.stringify(orders, null, 2);
  if (BLOB_ENABLED) {
    await put(BLOB_PATH, json, {
      access: "private",
      contentType: "application/json",
    });
  } else {
    writeFileSync(ORDERS_FILE, json, "utf-8");
  }
}

/** 生成可读的订单号，如 SN-20260903-A1B2 */
function generateOrderNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SN-${date}-${rand}`;
}

export interface CreateOrderInput {
  customerEmail: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: "stripe" | "paypal";
}

/** 创建订单并写入 */
export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const now = new Date().toISOString();
  const order: Order = {
    id: `ord_${Date.now()}`,
    orderNumber: generateOrderNumber(),
    customerEmail: input.customerEmail,
    shippingAddress: input.shippingAddress,
    items: input.items,
    subtotal: input.subtotal,
    shipping: input.shipping,
    total: input.total,
    paymentMethod: input.paymentMethod,
    paymentStatus: "paid",
    status: "pending",
    sourcing: { status: "none" },
    createdAt: now,
    updatedAt: now,
  };

  const orders = await readOrders();
  orders.push(order);
  await writeOrders(orders);
  return order;
}

/** 根据订单号更新订单字段并写入，返回更新后的订单（找不到返回 null） */
export async function updateOrder(
  orderNumber: string,
  patch: Partial<Order>
): Promise<Order | null> {
  const orders = await readOrders();
  const index = orders.findIndex((o) => o.orderNumber === orderNumber);
  if (index === -1) return null;

  orders[index] = {
    ...orders[index],
    ...patch,
    // 保证关键标识不被覆盖
    id: orders[index].id,
    orderNumber: orders[index].orderNumber,
    updatedAt: new Date().toISOString(),
  };

  await writeOrders(orders);
  return orders[index];
}

/** 根据订单号删除订单，返回是否删除成功 */
export async function deleteOrder(orderNumber: string): Promise<boolean> {
  const orders = await readOrders();
  const next = orders.filter((o) => o.orderNumber !== orderNumber);
  if (next.length === orders.length) return false;
  await writeOrders(next);
  return true;
}