"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

export default function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal, shippingFee, isFreeShipping, totalItems, clearCart } = useCart();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<"stripe" | "paypal" | null>(null);
  const [error, setError] = useState("");
  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
    phone: "",
  });

  const total = subtotal + shippingFee;

  // 地址字段更新
  const setAddressField = (field: string, value: string) =>
    setShippingAddress((prev) => ({ ...prev, [field]: value }));

  // 校验地址必填项
  const validateAddress = (): boolean => {
    const { name, line1, city, postalCode } = shippingAddress;
    return !!(name.trim() && line1.trim() && city.trim() && postalCode.trim());
  };

  // 支付成功后创建订单（不阻塞跳转）
  const createOrder = async (paymentMethod: "stripe" | "paypal") => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerEmail: email,
          shippingAddress,
          items: items.map((item) => ({
            productSlug: item.product.slug,
            productName: item.product.name,
            color: item.color,
            quantity: item.quantity,
            unitPrice: item.product.price,
          })),
          subtotal,
          shipping: shippingFee,
          total,
          paymentMethod,
        }),
      });
      if (!res.ok) {
        console.error("创建订单失败：", await res.text());
      }
    } catch (e) {
      console.error("创建订单失败：", e);
    }
  };

  // ====== Stripe 支付 ======
  const handleStripeCheckout = async () => {
    if (!validateAddress()) {
      setError("Please fill in your shipping address before paying.");
      return;
    }
    setLoading("stripe");
    setError("");

    try {
      const lineItems = items.map((item) => ({
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.images[0]
          ? `${window.location.origin}${item.product.images[0]}`
          : undefined,
      }));

      const res = await fetch("/api/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: lineItems, customerEmail: email }),
      });

      const data = await res.json();

      if (data.url) {
        if (data.url.includes("/checkout/success?mock=true")) {
          // 开发模式模拟：创建订单后跳转成功页
          await createOrder("stripe");
          clearCart();
          router.push("/checkout/success?mock=true");
        } else {
          // 生产模式：跳转 Stripe 支付页（订单由 webhook 创建）
          clearCart();
          window.location.href = data.url;
        }
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Unable to connect to payment service.");
    } finally {
      setLoading(null);
    }
  };

  // ====== PayPal 支付 ======
  const handlePayPalCreateOrder = async () => {
    if (!validateAddress()) {
      setError("Please fill in your shipping address before paying.");
      throw new Error("Address required");
    }
    const lineItems = items.map((item) => ({
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    }));

    const res = await fetch("/api/paypal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: lineItems, action: "create" }),
    });

    const data = await res.json();

    if (data.mock) {
      // 开发模式：直接创建 mock 订单
      return "mock-order-id";
    }

    return data.id;
  };

  const handlePayPalApprove = async (data: { orderID: string }) => {
    const res = await fetch("/api/paypal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderID: data.orderID, action: "capture" }),
    });

    const result = await res.json();

    if (result.mock || result.status === "COMPLETED") {
      await createOrder("paypal");
      clearCart();
      router.push(`/checkout/success?paypal=true&order_id=${data.orderID}`);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-16 space-y-4">
        <span className="text-5xl">🛒</span>
        <h2 className="text-2xl font-bold text-brand-charcoal">
          Your cart is empty
        </h2>
        <p className="text-brand-steel">
          Add some products before checking out.
        </p>
        <button
          onClick={() => router.push("/shop")}
          className="inline-flex px-6 py-2.5 text-sm font-semibold bg-brand-copper text-white rounded-md hover:bg-[#B8953E] transition-colors"
        >
          Browse Products
        </button>
      </div>
    );
  }

  const paypalClientId =
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ||
    "sb-placeholder";

  return (
    <div className="grid lg:grid-cols-5 gap-10">
      {/* ====== 左：联系信息 + 支付 ====== */}
      <div className="lg:col-span-3 space-y-8">
        {/* 联系邮箱 */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-brand-charcoal">
            Contact Information
          </h2>
          <div>
            <label className="block text-sm font-medium text-brand-charcoal mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-brand-copper transition-colors"
              required
            />
            <p className="text-xs text-brand-steel mt-1.5">
              We&apos;ll send your order confirmation to this email.
            </p>
          </div>
        </div>

        {/* 收货地址 */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-brand-charcoal">
            Shipping Address
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Full name"
              value={shippingAddress.name}
              onChange={(e) => setAddressField("name", e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-brand-copper transition-colors"
            />
            <input
              type="text"
              placeholder="Phone (optional)"
              value={shippingAddress.phone}
              onChange={(e) => setAddressField("phone", e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-brand-copper transition-colors"
            />
          </div>
          <input
            type="text"
            placeholder="Street address"
            value={shippingAddress.line1}
            onChange={(e) => setAddressField("line1", e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-brand-copper transition-colors"
          />
          <input
            type="text"
            placeholder="Apartment, suite, etc. (optional)"
            value={shippingAddress.line2}
            onChange={(e) => setAddressField("line2", e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-brand-copper transition-colors"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="City"
              value={shippingAddress.city}
              onChange={(e) => setAddressField("city", e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-brand-copper transition-colors"
            />
            <input
              type="text"
              placeholder="State"
              value={shippingAddress.state}
              onChange={(e) => setAddressField("state", e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-brand-copper transition-colors"
            />
            <input
              type="text"
              placeholder="ZIP code"
              value={shippingAddress.postalCode}
              onChange={(e) => setAddressField("postalCode", e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-brand-copper transition-colors"
            />
          </div>
          <select
            value={shippingAddress.country}
            onChange={(e) => setAddressField("country", e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-brand-copper transition-colors bg-white"
          >
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="GB">United Kingdom</option>
            <option value="AU">Australia</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* 支付方式选择 */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-brand-charcoal">
            Payment Method
          </h2>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-3">
            {/* Stripe */}
            <button
              onClick={handleStripeCheckout}
              disabled={loading !== null}
              className="w-full flex items-center justify-between px-5 py-4 border-2 border-gray-200 rounded-lg hover:border-brand-copper transition-colors disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">💳</span>
                <div className="text-left">
                  <p className="text-sm font-semibold text-brand-charcoal">
                    Credit / Debit Card
                  </p>
                  <p className="text-xs text-brand-steel">
                    Visa, Mastercard, Amex, Discover
                  </p>
                </div>
              </div>
              {loading === "stripe" ? (
                <span className="text-sm text-brand-steel">Loading...</span>
              ) : (
                <span className="text-brand-steel">→</span>
              )}
            </button>

            {/* PayPal */}
            <div className="border-2 border-gray-200 rounded-lg px-5 py-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-lg">🅿️</span>
                <div className="text-left">
                  <p className="text-sm font-semibold text-brand-charcoal">
                    PayPal
                  </p>
                  <p className="text-xs text-brand-steel">
                    Pay with your PayPal account
                  </p>
                </div>
              </div>
              {paypalClientId && paypalClientId !== "sb-placeholder" ? (
                <PayPalScriptProvider
                  options={{
                    clientId: paypalClientId,
                    currency: "USD",
                    intent: "capture",
                  }}
                >
                  <PayPalButtons
                    style={{ layout: "horizontal", tagline: false, height: 40 }}
                    createOrder={handlePayPalCreateOrder}
                    onApprove={handlePayPalApprove}
                    onError={() =>
                      setError("PayPal checkout failed. Please try again.")
                    }
                  />
                </PayPalScriptProvider>
              ) : (
                <p className="text-xs text-brand-steel italic py-2">
                  PayPal will be available after adding your PayPal Client ID to
                  .env.local
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ====== 右：订单摘要 ====== */}
      <div className="lg:col-span-2">
        <div className="bg-brand-light rounded-xl p-6 space-y-4 sticky top-24">
          <h2 className="text-lg font-bold text-brand-charcoal">
            Order Summary
          </h2>

          {/* 商品列表 */}
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={`${item.product.slug}-${item.color}`}
                className="flex justify-between text-sm"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-brand-charcoal font-medium truncate">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-brand-steel">
                    {item.color} × {item.quantity}
                  </p>
                </div>
                <span className="text-brand-charcoal font-medium ml-3">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <hr className="border-gray-200" />

          {/* 价格明细 */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-brand-steel">
              <span>Subtotal ({totalItems} items)</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-brand-steel">
              <span>Shipping</span>
              <span>
                {isFreeShipping ? (
                  <span className="text-brand-leaf font-medium">FREE</span>
                ) : (
                  `$${shippingFee.toFixed(2)}`
                )}
              </span>
            </div>
            <div className="flex justify-between text-brand-charcoal font-bold text-base pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          {/* 安全提示 */}
          <div className="flex items-center gap-2 text-xs text-brand-steel pt-2">
            <span>🔒</span>
            <span>
              Secure checkout. Your payment info is processed by Stripe/PayPal
              — we never see your card details.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
