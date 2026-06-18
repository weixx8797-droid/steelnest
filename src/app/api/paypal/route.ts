/**
 * PayPal Orders API
 * POST /api/paypal
 * 创建 PayPal 订单，返回订单 ID
 *
 * 前端 PayPal Buttons → createOrder 调用此 API → 获取 orderID → 用户授权支付
 * 前端 onApprove → captureOrder 调用此 API → 完成扣款
 */

import { NextResponse } from "next/server";

const PAYPAL_API =
  process.env.PAYPAL_API_URL || "https://api-m.sandbox.paypal.com";
const PAYPAL_CLIENT_ID =
  process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "sb-placeholder";
const PAYPAL_SECRET = process.env.PAYPAL_SECRET_KEY || "placeholder";

// 获取 PayPal Access Token
async function getAccessToken(): Promise<string> {
  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  });
  const data = await res.json();
  return data.access_token;
}

// POST: 创建订单
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, action } = body; // action: "create" | "capture"

    // ====== 创建 PayPal 订单 ======
    if (action === "create") {
      if (!items || items.length === 0) {
        return NextResponse.json(
          { error: "No items in cart" },
          { status: 400 }
        );
      }
      // 如果没配 PayPal 密钥，返回模拟
      if (PAYPAL_CLIENT_ID === "sb-placeholder") {
        return NextResponse.json({ id: "mock-order-id", mock: true });
      }
      const accessToken = await getAccessToken();
      const total = items.reduce(
        (sum: number, i: { price: number; quantity: number }) =>
          sum + i.price * i.quantity,
        0
      );
      const shipping = total >= 49 ? 0 : 5.99;
      const orderTotal = (total + shipping).toFixed(2);
      const res = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: "USD",
                value: orderTotal,
                breakdown: {
                  item_total: { currency_code: "USD", value: total.toFixed(2) },
                  shipping: {
                    currency_code: "USD",
                    value: shipping.toFixed(2),
                  },
                },
              },
              items: items.map(
                (item: {
                  name: string;
                  price: number;
                  quantity: number;
                }) => ({
                  name: item.name,
                  unit_amount: {
                    currency_code: "USD",
                    value: item.price.toFixed(2),
                  },
                  quantity: item.quantity.toString(),
                })
              ),
            },
          ],
        }),
      });
      const data = await res.json();
      return NextResponse.json({ id: data.id });
    }

    // ====== 捕获订单（扣款） ======
    if (action === "capture") {
      const { orderID } = body;
      if (!orderID) {
        return NextResponse.json(
          { error: "Missing orderID" },
          { status: 400 }
        );
      }
      if (PAYPAL_CLIENT_ID === "sb-placeholder" || orderID === "mock-order-id") {
        return NextResponse.json({ status: "COMPLETED", mock: true });
      }
      const accessToken = await getAccessToken();
      const res = await fetch(
        `${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await res.json();
      return NextResponse.json({ status: data.status, details: data });
    }

    return NextResponse.json(
      { error: "Invalid action. Use 'create' or 'capture'." },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("PayPal error:", error);
    return NextResponse.json(
      { error: error.message || "PayPal error" },
      { status: 500 }
    );
  }
}
