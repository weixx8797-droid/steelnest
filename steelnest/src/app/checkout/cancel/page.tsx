import Link from "next/link";

export const metadata = {
  title: "Payment Cancelled",
};

export default function CancelPage() {
  return (
    <div className="bg-white">
      <div className="container-page py-20 text-center">
        <div className="max-w-md mx-auto space-y-6">
          {/* 取消图标 */}
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#636E72"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-brand-charcoal">
            Payment Cancelled
          </h1>

          <p className="text-brand-steel leading-relaxed">
            Your payment was not processed. Don&apos;t worry — your cart items
            are still saved. You can try again or choose a different payment
            method.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Link
              href="/checkout"
              className="inline-flex items-center justify-center px-6 py-3 bg-brand-copper text-white text-sm font-semibold rounded-md hover:bg-[#B8953E] transition-colors"
            >
              Try Again
            </Link>
            <Link
              href="/cart"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-200 text-brand-charcoal text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
            >
              Back to Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
