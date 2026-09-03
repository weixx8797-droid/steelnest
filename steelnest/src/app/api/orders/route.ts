/**
 * POST /api/orders — 创建订单（顾客下单后由前端调用）
 * 公开接口（顾客动作，无需 admin 认证）
 */

import { NextResponse } from "next/server";
import {
  createOrder,
  type CreateOrderInput,
  type OrderItem,
  type ShippingAddress,
} from "@/lib/orders";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const items = body.items as OrderItem[] | undefined;
    const shippingAddress = body.shippingAddress as ShippingAddress | undefined;
    const customerEmail = body.customerEmail as string | undefined;

    // 基础校验
    if (!customerEmail || !shippingAddress || !items || items.length === 0) {
      return NextResponse.json(
        { error: "缺少必要信息（邮箱/收货地址/商品）" },
        { status: 400 }
      );
    }
    if (!shippingAddress.name || !shippingAddress.line1 || !shippingAddress.city || !shippingAddress.postalCode) {
      return NextResponse.json(
        { error: "收货地址不完整" },
        { status: 400 }
      );
    }

    const input: CreateOrderInput = {
      customerEmail,
      shippingAddress,
      items,
      subtotal: Number(body.subtotal) || 0,
      shipping: Number(body.shipping) || 0,
      total: Number(body.total) || 0,
      paymentMethod: body.paymentMethod === "paypal" ? "paypal" : "stripe",
    };

    const order = createOrder(input);
    return NextResponse.json({ ok: true, orderNumber: order.orderNumber });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "创建订单失败" },
      { status: 500 }
    );
  }
}
