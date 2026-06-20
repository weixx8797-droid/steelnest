"use client";

import { useCart } from "@/lib/cart-context";
import Image from "next/image";
import Link from "next/link";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    subtotal,
    shippingFee,
    totalItems,
    isFreeShipping,
    freeShippingRemaining,
    freeShippingThreshold,
  } = useCart();

  const total = subtotal + shippingFee;

  return (
    <>
      {/* ====== 遮罩层（点击关闭） ====== */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* ====== 购物车抽屉 ====== */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[420px] bg-white shadow-2xl transform transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* ---- 顶部标题栏 ---- */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-brand-charcoal">
            Your Cart{" "}
            {totalItems > 0 && (
              <span className="text-brand-steel font-normal">
                ({totalItems})
              </span>
            )}
          </h2>
          <button
            onClick={closeCart}
            className="p-2 text-brand-steel hover:text-brand-charcoal transition-colors"
            aria-label="Close cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* ---- 包邮进度条 ---- */}
        {items.length > 0 && (
          <div className="px-5 py-3 bg-brand-light border-b border-gray-100">
            {isFreeShipping ? (
              <p className="text-sm text-brand-leaf font-medium flex items-center gap-1.5">
                <span>🎉</span> You&apos;ve unlocked free shipping!
              </p>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-brand-steel">
                  Add{" "}
                  <span className="font-semibold text-brand-charcoal">
                    ${freeShippingRemaining.toFixed(2)}
                  </span>{" "}
                  more for free shipping
                </p>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-copper rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        (subtotal / freeShippingThreshold) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ---- 商品列表 ---- */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <span className="text-5xl">🛒</span>
              <p className="text-brand-steel">Your cart is empty.</p>
              <Link
                href="/shop"
                onClick={closeCart}
                className="text-sm font-semibold text-brand-copper hover:underline"
              >
                Continue Shopping →
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.product.slug}-${item.color}`}
                className="flex gap-3 py-3 border-b border-gray-50 last:border-0"
              >
                {/* 产品缩略图 */}
                <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-brand-light">
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>

                {/* 产品信息 */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-brand-charcoal truncate">
                    {item.product.name}
                  </h3>
                  <p className="text-xs text-brand-steel mt-0.5">
                    {item.color}
                  </p>
                  <p className="text-sm font-bold text-brand-charcoal mt-1">
                    ${item.product.price}
                  </p>

                  {/* 数量控制 */}
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-gray-200 rounded-md">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.slug,
                            item.color,
                            item.quantity - 1
                          )
                        }
                        className="px-2.5 py-1 text-sm text-brand-steel hover:text-brand-charcoal transition-colors"
                      >
                        −
                      </button>
                      <span className="px-2.5 py-1 text-sm font-medium text-brand-charcoal min-w-[32px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.slug,
                            item.color,
                            item.quantity + 1
                          )
                        }
                        className="px-2.5 py-1 text-sm text-brand-steel hover:text-brand-charcoal transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* 删除按钮 */}
                    <button
                      onClick={() =>
                        removeFromCart(item.product.slug, item.color)
                      }
                      className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ---- 底部结算栏 ---- */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-4 space-y-3 bg-white">
            {/* 价格明细 */}
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-brand-steel">
                <span>Subtotal</span>
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
              <div className="flex justify-between text-brand-charcoal font-bold text-base pt-1.5 border-t border-gray-100">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* 结算按钮 */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full py-3 bg-brand-copper text-white text-sm font-semibold text-center rounded-md hover:bg-[#B8953E] transition-colors tracking-wide"
            >
              Checkout — ${total.toFixed(2)}
            </Link>

            {/* 继续购物 */}
            <button
              onClick={closeCart}
              className="block w-full text-center text-xs text-brand-steel hover:text-brand-charcoal transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
