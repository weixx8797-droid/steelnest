/**
 * 订单读写工具
 * 订单数据持久化到 src/data/orders.json
 */

import { readFileSync, writeFileSync } from "fs";
import path from "path";

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

/** 从 JSON 文件读取订单列表 */
export function readOrders(): Order[] {
  try {
    const raw = readFileSync(ORDERS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** 将订单列表写回 JSON 文件 */
export function writeOrders(orders: Order[]): void {
  writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
}

/** 生成可读的订单号，如 SN-20260823-A1B2 */
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
export function createOrder(input: CreateOrderInput): Order {
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

  const orders = readOrders();
  orders.push(order);
  writeOrders(orders);
  return order;
}

/** 根据订单号更新订单字段并写入，返回更新后的订单（找不到返回 null） */
export function updateOrder(
  orderNumber: string,
  patch: Partial<Order>
): Order | null {
  const orders = readOrders();
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

  writeOrders(orders);
  return orders[index];
}

/** 根据订单号删除订单，返回是否删除成功 */
export function deleteOrder(orderNumber: string): boolean {
  const orders = readOrders();
  const next = orders.filter((o) => o.orderNumber !== orderNumber);
  if (next.length === orders.length) return false;
  writeOrders(next);
  return true;
}
