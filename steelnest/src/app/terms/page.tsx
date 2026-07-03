import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "SteelNest terms of service — conditions of use for our website and products.",
};

export default function TermsPage() {
  return (
    <div className="bg-white">
      <div className="container-page py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-charcoal mb-2">
          Terms of Service
        </h1>
        <p className="text-brand-steel mb-10">Last updated: June 2026</p>

        <div className="max-w-3xl space-y-10">
          {[
            {
              title: "Acceptance of Terms",
              content:
                "By accessing or using the SteelNest website and purchasing our products, you agree to be bound by these Terms of Service. If you do not agree, please do not use our site.",
            },
            {
              title: "Products & Pricing",
              content:
                "All product descriptions, images, and prices are subject to change without notice. We reserve the right to modify or discontinue any product at any time. Prices are listed in US Dollars (USD). We strive for accuracy but do not warrant that product descriptions or pricing are error-free.",
            },
            {
              title: "Orders & Payment",
              content:
                "By placing an order, you agree to provide accurate and complete information. We reserve the right to refuse or cancel any order for reasons including product availability, pricing errors, or suspected fraud. Payment is processed securely through Stripe and PayPal.",
            },
            {
              title: "Shipping & Delivery",
              content:
                "Shipping times are estimates and not guaranteed. SteelNest is not responsible for delays caused by customs, carrier issues, or events beyond our control. The risk of loss passes to you upon delivery of the product to the carrier.",
            },
            {
              title: "Intellectual Property",
              content:
                "All content on this website — including text, images, logos, and product designs — is the property of SteelNest and protected by applicable intellectual property laws. You may not reproduce, distribute, or use our content without written permission.",
            },
            {
              title: "Limitation of Liability",
              content:
                "SteelNest is not liable for any indirect, incidental, or consequential damages arising from the use of our products or website. Our total liability is limited to the purchase price of the product in question.",
            },
            {
              title: "Governing Law",
              content:
                "These terms are governed by the laws of the People's Republic of China. Any disputes shall be resolved through negotiation first, and if unsuccessful, through the appropriate courts.",
            },
          ].map((section) => (
            <div key={section.title} className="space-y-3">
              <h2 className="text-xl font-bold text-brand-charcoal">
                {section.title}
              </h2>
              <p className="text-sm text-brand-steel leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}

          <div className="bg-brand-light rounded-xl p-6 text-sm text-brand-steel">
            <p className="font-semibold text-brand-charcoal mb-1">Questions?</p>
            <p>
              Contact us at{" "}
              <span className="text-brand-copper font-medium">hello@steelnest.com</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
