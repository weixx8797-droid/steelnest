/**
 * GET /api/admin/orders — 获取订单列表
 * PUT /api/admin/orders — 更新订单（状态/采购/物流单号），标记发货时触发邮件
 */

import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { readOrders, updateOrder, deleteOrder } from "@/lib/orders";
import { sendShipmentEmail } from "@/lib/email";

export async function GET() {
  const orders = readOrders();
  // 最新的订单排前面
  return NextResponse.json(orders.slice().reverse());
}

export async function PUT(request: Request) {
  const authed = await isAdminAuthenticated();
  if (!authed) return NextResponse.json({ error: "未登录" }, { status: 401 });

  try {
    const body = await request.json();
    const { orderNumber, ...updates } = body;

    if (!orderNumber) {
      return NextResponse.json({ error: "缺少订单号" }, { status: 400 });
    }

    const order = updateOrder(orderNumber, updates);
    if (!order) {
      return NextResponse.json({ error: "订单不存在" }, { status: 404 });
    }

    // 标记发货 + 有物流单号 → 触发发货通知邮件
    if (order.status === "shipped" && order.trackingNumber) {
      try {
        await sendShipmentEmail(order);
      } catch (e) {
        console.error("发送发货邮件失败：", e);
      }
    }

    return NextResponse.json({ ok: true, order });
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
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get("orderNumber");

    if (!orderNumber) {
      return NextResponse.json({ error: "缺少订单号" }, { status: 400 });
    }

    const ok = deleteOrder(orderNumber);
    if (!ok) {
      return NextResponse.json({ error: "订单不存在" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "删除失败" },
      { status: 500 }
    );
  }
}
