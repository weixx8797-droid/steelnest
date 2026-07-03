import { Metadata } from "next";
import CheckoutForm from "@/components/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Secure checkout — pay with credit card or PayPal.",
};

export default function CheckoutPage() {
  return (
    <div className="bg-white">
      <div className="container-page py-10 md:py-14">
        {/* 面包屑 */}
        <nav className="flex items-center gap-2 text-sm text-brand-steel mb-8">
          <a href="/" className="hover:text-brand-copper transition-colors">
            Home
          </a>
          <span>/</span>
          <span className="text-brand-charcoal font-medium">Checkout</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold text-brand-charcoal mb-10">
          Checkout
        </h1>

        {/* 客户端表单：订单摘要 + 支付按钮 */}
        <CheckoutForm />
      </div>
    </div>
  );
}
