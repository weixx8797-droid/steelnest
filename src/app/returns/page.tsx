import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Returns & Refunds",
  description: "SteelNest return policy — 30-day returns, refund process, and warranty information.",
};

export default function ReturnsPage() {
  return (
    <div className="bg-white">
      <div className="container-page py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-charcoal mb-2">
          Returns & Refunds
        </h1>
        <p className="text-brand-steel mb-10">Last updated: June 2026</p>

        <div className="max-w-3xl space-y-10">
          {[
            {
              title: "30-Day Return Policy",
              content:
                "We accept returns within 30 days of the delivery date. If 30 days have passed since your order was delivered, unfortunately we cannot offer a return or refund.",
            },
            {
              title: "Return Conditions",
              content: "",
              list: [
                "Products must be in original condition with all accessories, manuals, and packaging included.",
                "Products showing signs of use, damage, or modification may not be eligible for a full refund.",
                "Returns must be initiated within 30 days of the delivery date.",
                "A valid order number or proof of purchase is required.",
              ],
            },
            {
              title: "Return Shipping",
              content: "",
              list: [
                "Defective or incorrect items: SteelNest covers the return shipping cost. We will provide a prepaid return label.",
                "Change of mind returns: The customer is responsible for return shipping costs.",
                "We recommend using a trackable shipping service for all returns.",
              ],
            },
            {
              title: "Refund Process",
              content:
                "Once your return is received and inspected, we will notify you via email. Approved refunds will be processed to the original payment method within 5–10 business days. Please note that your bank or credit card company may require additional time to post the refund to your account.",
            },
            {
              title: "Damaged or Defective Items",
              content:
                "If your order arrives damaged or with a manufacturing defect, please contact us within 48 hours of delivery. Include photos of the damage so we can process a replacement or refund as quickly as possible. We stand behind every product we ship.",
            },
            {
              title: "5-Year Warranty",
              content:
                "Every SteelNest product comes with a 5-year manufacturer warranty against defects in materials and workmanship. This warranty does not cover damage from misuse, unauthorized modifications, or normal wear and tear. To make a warranty claim, contact us with your order number and a description of the issue.",
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

          <div className="bg-brand-light rounded-xl p-6 text-sm text-brand-steel space-y-2">
            <p className="font-semibold text-brand-charcoal">Start a Return</p>
            <p>
              To initiate a return, please email us at{" "}
              <span className="text-brand-copper font-medium">returns@steelnest.com</span>{" "}
              with your order number and the reason for return. We&apos;ll respond
              within 24 hours with return instructions.
            </p>
            <p>
              Or visit our{" "}
              <Link href="/contact" className="text-brand-copper hover:underline">
                Contact page
              </Link>{" "}
              for other ways to reach us.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
