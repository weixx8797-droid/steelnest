import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about LabOrigin — lab-grown diamond sourcing, grading, MOQ, payment terms, and logistics.",
};

const faqs = [
  {
    q: "What is your minimum order quantity (MOQ)?",
    a: "There is no fixed MOQ for loose stones — you can start with a single stone to evaluate our quality. For bulk and white-label programs, pricing improves with volume. Tell us your quantity and we'll quote accordingly.",
  },
  {
    q: "Are your diamonds certified?",
    a: "Yes. We supply stones graded by IGI or GIA, and every certificate number can be verified online. We also cross-check the certificate against the physical stone before shipment.",
  },
  {
    q: "What shapes, sizes, and colors can you source?",
    a: "Round, oval, emerald, cushion, princess, pear, marquise, and radiant — from melee up to 5ct+. Colorless D–F and near-colorless G–J, plus fancy colors (pink, blue, yellow).",
  },
  {
    q: "What are your payment terms?",
    a: "We typically work on a deposit-plus-balance or full-payment-before-shipment basis, depending on order size and your relationship with us. Bank transfer (T/T) is standard; other terms can be discussed for established partners.",
  },
  {
    q: "How does shipping work?",
    a: "We ship via insured express (FedEx, UPS, DHL) door-to-door. We can quote FOB, CIF, or DDP Incoterms depending on your destination. All shipments are insured and include discreet, secure packaging.",
  },
  {
    q: "How long does sourcing take?",
    a: "For stones in our current stock sheet, we can provide video approval within 24 hours and ship within 2–3 business days. For specific specs not in stock, sourcing typically takes 5–10 business days.",
  },
  {
    q: "Do you offer white-label or dropshipping?",
    a: "Yes. We offer dropshipping direct to your end customer, custom branded packaging, and finished-jewelry setting services. See our White Label page for details.",
  },
  {
    q: "How do you ensure quality?",
    a: "Every stone is inspected under 20x magnification, checked for fire and brilliance under controlled lighting, and photographed/videoed before shipment. You approve the stone before it ships.",
  },
  {
    q: "Can I request a specific stone to be held or inspected?",
    a: "Absolutely. That's the core of our service — tell us the spec, and we'll pull stones from the factory, record inspection videos, and hold them for your decision.",
  },
];

export default function FAQPage() {
  return (
    <div className="bg-brand-cream">
      <div className="container-page py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-charcoal mb-2">
          Frequently Asked Questions
        </h1>
        <p className="text-brand-steel mb-10 max-w-lg">
          Everything you need to know about sourcing lab-grown diamonds with
          LabOrigin.
        </p>

        <div className="max-w-3xl space-y-1">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="group border border-gray-100 rounded-sm bg-brand-cream/50 hover:bg-brand-light transition-colors"
            >
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-semibold text-brand-charcoal list-none">
                {faq.q}
                <span className="text-brand-copper text-lg group-open:rotate-45 transition-transform ml-3">
                  +
                </span>
              </summary>
              <p className="px-5 pb-4 text-sm text-brand-steel leading-relaxed">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
