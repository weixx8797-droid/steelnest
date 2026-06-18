import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: "SteelNest shipping policy — rates, delivery times, and tracking information.",
};

export default function ShippingPage() {
  return (
    <div className="bg-white">
      <div className="container-page py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-charcoal mb-2">
          Shipping Policy
        </h1>
        <p className="text-brand-steel mb-10">Last updated: June 2026</p>

        <div className="max-w-3xl space-y-10">
          {[
            {
              title: "Processing Time",
              content:
                "All orders are processed within 1–2 business days (excluding weekends and holidays). You will receive an email confirmation once your order has been shipped with a tracking number.",
            },
            {
              title: "Shipping Rates",
              content: "",
              list: [
                "Free standard shipping on all orders over $49 USD.",
                "Flat rate shipping of $5.99 USD for orders under $49.",
                "Shipping costs are calculated at checkout based on your order total.",
              ],
            },
            {
              title: "Delivery Times",
              content: "",
              list: [
                "United States: 7–12 business days",
                "Canada: 10–14 business days",
                "United Kingdom: 7–12 business days",
                "European Union: 10–14 business days",
                "Australia & New Zealand: 10–16 business days",
                "Please note: delivery times are estimates and may vary due to customs processing.",
              ],
            },
            {
              title: "International Shipping",
              content:
                "We ship to the United States, Canada, United Kingdom, Australia, New Zealand, and most EU countries. If your country is not listed at checkout, please contact us at hello@steelnest.com.",
            },
            {
              title: "Customs & Duties",
              content:
                "International orders may be subject to customs duties, taxes, or import fees upon arrival in the destination country. These charges are the responsibility of the customer. SteelNest is not responsible for delays caused by customs processing.",
            },
            {
              title: "Order Tracking",
              content:
                "Once your order ships, you will receive a tracking number via email. You can track your package on the carrier's website. If you haven't received a tracking number within 3 business days of your order, please contact us.",
            },
          ].map((section) => (
            <div key={section.title} className="space-y-3">
              <h2 className="text-xl font-bold text-brand-charcoal">
                {section.title}
              </h2>
              {section.content && (
                <p className="text-sm text-brand-steel leading-relaxed">
                  {section.content}
                </p>
              )}
              {section.list && (
                <ul className="space-y-1.5">
                  {section.list.map((item, i) => (
                    <li key={i} className="text-sm text-brand-steel flex gap-2">
                      <span className="text-brand-copper">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <div className="bg-brand-light rounded-xl p-6 text-sm text-brand-steel">
            <p className="font-semibold text-brand-charcoal mb-1">Questions about shipping?</p>
            <p>
              Contact us at{" "}
              <Link href="/contact" className="text-brand-copper hover:underline">
                hello@steelnest.com
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
