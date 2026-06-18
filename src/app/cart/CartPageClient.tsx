"use client";

import { useCart } from "@/lib/cart-context";
import Image from "next/image";
import Link from "next/link";

export default function CartPageClient() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    subtotal,
    shippingFee,
    totalItems,
    isFreeShipping,
    freeShippingRemaining,
  } = useCart();

  const total = subtotal + shippingFee;

  if (items.length === 0) {
    return (
      <div className="text-center py-20 space-y-4">
        <span className="text-6xl">🛒</span>
        <h2 className="text-2xl font-bold text-brand-charcoal">Your cart is empty</h2>
        <p className="text-brand-steel">Looks like you haven&apos;t added anything yet.</p>
        <Link
          href="/shop"
          className="inline-flex px-8 py-3 bg-brand-copper text-white text-sm font-semibold rounded-md hover:bg-[#B8953E] transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-10">
      {/* ====== 商品列表 ====== */}
      <div className="lg:col-span-2 space-y-4">
        {/* 包邮提示 */}
        {!isFreeShipping && (
          <div className="bg-brand-copper/10 border border-brand-copper/20 rounded-lg px-4 py-3 text-sm text-brand-charcoal">
            Add{" "}
            <span className="font-bold text-brand-copper">
              ${freeShippingRemaining.toFixed(2)}
            </span>{" "}
            more to unlock <span className="font-semibold">free shipping</span>!
          </div>
        )}

        {items.map((item) => (
          <div
            key={`${item.product.slug}-${item.color}`}
            className="flex gap-4 p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors"
          >
            {/* 缩略图 */}
            <Link
              href={`/products/${item.product.slug}`}
              className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-brand-light"
            >
              <Image
                src={item.product.images[0]}
                alt={item.product.name}
                fill
                className="object-cover"
                sizes="96px"
              />
            </Link>

            {/* 产品信息 */}
            <div className="flex-1 min-w-0">
              <Link
                href={`/products/${item.product.slug}`}
                className="text-sm font-semibold text-brand-charcoal hover:text-brand-copper transition-colors"
              >
                {item.product.name}
              </Link>
              <p className="text-xs text-brand-steel mt-0.5">{item.color}</p>
              <p className="text-sm font-bold text-brand-charcoal mt-1">
                ${item.product.price}
              </p>

              {/* 数量 + 操作 */}
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center border border-gray-200 rounded-md">
                  <button
                    onClick={() =>
                      updateQuantity(item.product.slug, item.color, item.quantity - 1)
                    }
                    className="px-2.5 py-1 text-sm text-brand-steel hover:text-brand-charcoal"
                  >
                    −
                  </button>
                  <span className="px-3 py-1 text-sm font-medium min-w-[36px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.product.slug, item.color, item.quantity + 1)
                    }
                    className="px-2.5 py-1 text-sm text-brand-steel hover:text-brand-charcoal"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.product.slug, item.color)}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>

            {/* 行总价 */}
            <div className="text-right shrink-0">
              <p className="text-sm font-bold text-brand-charcoal">
                ${(item.product.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}

        {/* 继续购物 */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-1 text-sm font-medium text-brand-copper hover:underline pt-2"
        >
          ← Continue Shopping
        </Link>
      </div>

      {/* ====== 订单摘要 ====== */}
      <div className="lg:col-span-1">
        <div className="bg-brand-light rounded-xl p-6 space-y-4 sticky top-24">
          <h2 className="text-lg font-bold text-brand-charcoal">Order Summary</h2>

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

          <Link
            href="/checkout"
            className="block w-full py-3 bg-brand-copper text-white text-sm font-semibold text-center rounded-md hover:bg-[#B8953E] transition-colors tracking-wide"
          >
            Proceed to Checkout
          </Link>

          <div className="flex items-center justify-center gap-2 text-xs text-brand-steel">
            <span>🔒</span>
            <span>Secure checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
}
