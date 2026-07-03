import Link from "next/link";

export const metadata = {
  title: "Order Confirmed",
};

export default function SuccessPage() {
  return (
    <div className="bg-white">
      <div className="container-page py-20 text-center">
        <div className="max-w-md mx-auto space-y-6">
          {/* 成功图标 */}
          <div className="w-20 h-20 bg-brand-leaf/10 rounded-full flex items-center justify-center mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4A7C59"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-brand-charcoal">
            Order Confirmed!
          </h1>

          <p className="text-brand-steel leading-relaxed">
            Thank you for your purchase! 🎉 We&apos;ll send a confirmation
            email with your order details shortly. Your SteelNest products are
            being prepared at our Luoyang factory and will ship soon.
          </p>

          <div className="bg-brand-light rounded-xl p-6 space-y-3 text-sm text-left">
            <h3 className="font-semibold text-brand-charcoal">
              What happens next?
            </h3>
            <ul className="space-y-2 text-brand-steel">
              <li className="flex gap-2">
                <span className="text-brand-leaf">1.</span>
                You&apos;ll receive an order confirmation email within minutes.
              </li>
              <li className="flex gap-2">
                <span className="text-brand-leaf">2.</span>
                Your order is processed within 1-2 business days.
              </li>
              <li className="flex gap-2">
                <span className="text-brand-leaf">3.</span>
                Once shipped, you&apos;ll get a tracking number via email.
              </li>
              <li className="flex gap-2">
                <span className="text-brand-leaf">4.</span>
                Typical delivery: 7-14 business days (international).
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-6 py-3 bg-brand-copper text-white text-sm font-semibold rounded-md hover:bg-[#B8953E] transition-colors"
            >
              Continue Shopping
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-200 text-brand-charcoal text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
