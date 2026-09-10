import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shipping & Logistics",
  description:
    "LabOrigin shipping and logistics — insured international express delivery, Incoterms, and lead times for lab-grown diamond orders.",
};

export default function ShippingPage() {
  return (
    <div className="bg-brand-cream">
      <div className="container-page py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-charcoal mb-2">
          Shipping &amp; Logistics
        </h1>
        <p className="text-brand-steel mb-10">Last updated: September 2026</p>

        <div className="max-w-3xl space-y-10">
          {[
            {
              title: "Lead Times",
              content:
                "Stones in our current stock ship within 2–3 business days after your approval. Specified sourcing typically takes 5–10 business days. White-label and finished-jewelry programs are quoted per order.",
            },
            {
              title: "Carriers & Insurance",
              content: "",
              list: [
                "Insured express via FedEx, UPS, or DHL — door-to-door with tracking.",
                "Every shipment is fully insured for its declared value.",
                "Discreet, tamper-evident packaging for high-value goods.",
              ],
            },
            {
              title: "Incoterms",
              content: "",
              list: [
                "FOB — you arrange and pay freight from our departure point.",
                "CIF — we cover freight and insurance to your destination port.",
                "DDP — we handle duties and delivery to your door (available to select destinations).",
                "We will confirm the applicable Incoterm on every quotation.",
              ],
            },
            {
              title: "International Shipping",
              content:
                "We ship worldwide. Common destinations include the United States, Canada, United Kingdom, European Union, Australia, and the Middle East. If your destination is not listed, contact us and we will confirm availability.",
            },
            {
              title: "Customs & Duties",
              content:
                "Unless DDP is agreed, import duties, taxes, and customs fees at the destination are the buyer's responsibility. We provide accurate harmonized-system (HS) documentation to minimize clearance delays.",
            },
            {
              title: "Order Tracking",
              content:
                "Once your order ships, you will receive a tracking number via email. You can track your package on the carrier's website.",
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

          <div className="bg-brand-light rounded-sm p-6 text-sm text-brand-steel">
            <p className="font-semibold text-brand-charcoal mb-1">
              Questions about logistics?
            </p>
            <p>
              Contact us at{" "}
              <Link href="/contact" className="text-brand-copper hover:underline">
                sourcing@steelneststore.com
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
