import { Metadata } from "next";
import CartPageClient from "./CartPageClient";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review your cart items before checkout.",
};

export default function CartPage() {
  return (
    <div className="bg-white">
      <div className="container-page py-10 md:py-14">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-charcoal mb-10">
          Your Cart
        </h1>
        <CartPageClient />
      </div>
    </div>
  );
}
