import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about SteelNest products, shipping, returns, and more.",
};

const faqs = [
  {
    q: "What material are SteelNest products made of?",
    a: "All SteelNest products are made from cold-rolled steel — a durable, recyclable metal that outlasts wood and plastic alternatives. Each product receives a rust-resistant electrostatic spray coating for long-lasting protection.",
  },
  {
    q: "Are SteelNest products really 100% recyclable?",
    a: "Yes. Steel is one of the most recycled materials on the planet. Unlike plastic or composite wood products, steel can be melted down and reformed indefinitely without losing quality. When a SteelNest product finally reaches the end of its life (which could be decades), it can be fully recycled.",
  },
  {
    q: "Do I need tools to assemble the products?",
    a: "No tools required! Every SteelNest product features our signature tool-free snap-lock or bolt-free assembly system. Most products can be assembled in under 5 minutes.",
  },
  {
    q: "How long does shipping take?",
    a: "Orders are processed within 1–2 business days. International shipping typically takes 7–14 business days depending on your location. You'll receive a tracking number via email once your order ships.",
  },
  {
    q: "What countries do you ship to?",
    a: "We ship to the United States, Canada, United Kingdom, Australia, New Zealand, and most European Union countries. If you're unsure whether we ship to your location, contact us before ordering.",
  },
  {
    q: "How much does shipping cost?",
    a: "Shipping is free on all orders over $49. For orders under $49, a flat shipping fee of $5.99 applies.",
  },
  {
    q: "What is your return policy?",
    a: "We accept returns within 30 days of delivery for any reason. Products must be in original condition with all accessories included. Return shipping is free for defective or incorrect items. For change-of-mind returns, the customer covers return shipping.",
  },
  {
    q: "Do SteelNest products rust?",
    a: "Our products are treated with a multi-layer rust-resistant coating: first an anti-rust primer, then an electrostatic spray coating, and finally a protective seal. Under normal indoor use, they will not rust. For bathroom products, we apply an additional moisture-sealed coating.",
  },
  {
    q: "Can I cancel or modify my order?",
    a: "You can cancel or modify your order within 12 hours of placing it. After that, the order may have already entered processing. Contact us immediately at hello@steelnest.com if you need to make changes.",
  },
  {
    q: "Do you offer wholesale or bulk pricing?",
    a: "Yes! As a factory-direct brand, we offer competitive wholesale pricing for bulk orders. Contact wholesale@steelnest.com with your requirements.",
  },
];

export default function FAQPage() {
  return (
    <div className="bg-white">
      <div className="container-page py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-charcoal mb-2">
          Frequently Asked Questions
        </h1>
        <p className="text-brand-steel mb-10 max-w-lg">
          Everything you need to know about SteelNest products, shipping, and policies.
        </p>

        <div className="max-w-3xl space-y-1">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="group border border-gray-100 rounded-lg bg-brand-cream/50 hover:bg-brand-light transition-colors"
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
