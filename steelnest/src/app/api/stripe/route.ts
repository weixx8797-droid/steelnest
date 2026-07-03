/**
 * Stripe Checkout API
 * POST /api/stripe
 * 创建 Stripe Checkout Session，返回支付页面 URL
 *
 * 前端调用 → 创建 Session → 返回 URL → 浏览器跳转 Stripe 支付页
 */

import { NextResponse } from "next/server";
import { stripe, isStripeConfigured } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, customerEmail } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "No items in cart" },
        { status: 400 }
      );
    }

    // 如果没配 Stripe 密钥，返回模拟成功（方便本地开发看流程）
    if (!isStripeConfigured()) {
      console.log("⚠️ Stripe not configured — returning mock URL");
      return NextResponse.json({
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/checkout/success?mock=true`,
      });
    }

    // 构建 Stripe line_items
    const lineItems = items.map(
      (item: {
        name: string;
        price: number;
        quantity: number;
        image?: string;
      }) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            ...(item.image ? { images: [item.image] } : {}),
          },
          unit_amount: Math.round(item.price * 100), // Stripe 用「分」计价
        },
        quantity: item.quantity,
      })
    );

    // 创建 Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/checkout/cancel`,
      customer_email: customerEmail || undefined,
      shipping_address_collection: {
        allowed_countries: [
          "US", "CA", "GB", "AU", "DE", "FR", "IT", "ES", "NL", "BE",
          "AT", "DK", "SE", "NO", "FI", "IE", "NZ", "JP", "SG", "KR",
        ],
      },
      line_items: lineItems,
      // 自动应用优惠（满$49包邮可以在metadata中标记）
      metadata: {
        source: "steelnest",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe error:", error);
    return NextResponse.json(
      { error: error.message || "Payment failed" },
      { status: 500 }
    );
  }
}
