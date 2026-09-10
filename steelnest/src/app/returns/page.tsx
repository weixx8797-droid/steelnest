import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Returns & Quality Guarantee",
  description:
    "LabOrigin returns and quality guarantee — inspection, acceptance, and defect handling for lab-grown diamond orders.",
};

export default function ReturnsPage() {
  return (
    <div className="bg-brand-cream">
      <div className="container-page py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-charcoal mb-2">
          Returns &amp; Quality Guarantee
        </h1>
        <p className="text-brand-steel mb-10">Last updated: September 2026</p>

        <div className="max-w-3xl space-y-10">
          {[
            {
              title: "Approval Before Shipment",
              content:
                "Because every stone is documented and approved by you before it ships, change-of-mind returns are generally not applicable. You approve the exact stone, video, and certificate prior to dispatch.",
            },
            {
              title: "Inspection & Acceptance",
              content: "",
              list: [
                "Inspect your order within 48 hours of delivery.",
                "Report any discrepancy against your approved stone within 48 hours.",
                "Photographic evidence is required for any claim.",
              ],
            },
            {
              title: "Defective or Incorrect Items",
              content:
                "If a stone does not match the approved certificate or was damaged in transit, contact us within 48 hours of delivery with photos. We will replace the stone or issue a refund, and we cover the return shipping for our error.",
            },
            {
              title: "Certificate Guarantee",
              content:
                "Every IGI or GIA certificate we supply can be verified online. If a certificate is found to be invalid or mismatched to the stone, we will resolve it at our cost.",
            },
            {
              title: "Refund Process",
              content:
                "Approved refunds are processed to the original payment method within 5–10 business days. Your bank or payment provider may require additional time to post the refund.",
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

          <div className="bg-brand-light rounded-sm p-6 text-sm text-brand-steel space-y-2">
            <p className="font-semibold text-brand-charcoal">Start a Claim</p>
            <p>
              To report an issue, email us at{" "}
              <span className="text-brand-copper font-medium">sourcing@steelneststore.com</span>{" "}
              with your order number, photos, and a description. We&apos;ll
              respond within 24 hours.
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
