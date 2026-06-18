/**
 * Stripe 客户端（服务端用）
 * 需要 STRIPE_SECRET_KEY 环境变量
 */
import Stripe from "stripe";

// 如果没有设置密钥，用占位符（不会真正发起支付）
const secretKey = process.env.STRIPE_SECRET_KEY || "sk_test_placeholder";

export const stripe = new Stripe(secretKey, {
  apiVersion: "2025-06-16.acacia" as any,
  typescript: true,
});

/**
 * 判断 Stripe 是否已配置真实密钥
 */
export function isStripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY && secretKey !== "sk_test_placeholder";
}
