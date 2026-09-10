import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "LabOrigin terms of service — conditions for using our B2B lab-grown diamond sourcing website.",
};

export default function TermsPage() {
  return (
    <div className="bg-brand-cream">
      <div className="container-page py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-charcoal mb-2">
          Terms of Service
        </h1>
        <p className="text-brand-steel mb-10">Last updated: September 2026</p>

        <div className="max-w-3xl space-y-10">
          {[
            {
              title: "Acceptance of Terms",
              content:
                "By accessing or using the LabOrigin website and engaging our sourcing services, you agree to be bound by these Terms of Service. If you do not agree, please do not use our site.",
            },
            {
              title: "Products & Pricing",
              content:
                "All listings are indicative and subject to availability and confirmation. Prices are quoted per order and in US Dollars (USD) unless otherwise agreed. We strive for accuracy but do not warrant that listings or pricing are error-free. Final terms are confirmed on each quotation or proforma invoice.",
            },
            {
              title: "Orders & Payment",
              content:
                "Orders are confirmed through a quotation or proforma invoice. Payment terms (deposit, balance, or full payment) are stated on each invoice. We reserve the right to decline any order or request.",
            },
            {
              title: "Shipping & Delivery",
              content:
                "Shipping terms follow the Incoterm agreed on your quotation (FOB, CIF, or DDP). Delivery times are estimates. LabOrigin is not responsible for delays caused by customs, carrier issues, or events beyond our control. Risk passes per the agreed Incoterm.",
            },
            {
              title: "Intellectual Property",
              content:
                "All content on this website — including text, images, logos, and designs — is the property of LabOrigin and protected by applicable intellectual property laws. You may not reproduce, distribute, or use our content without written permission.",
            },
            {
              title: "Limitation of Liability",
              content:
                "LabOrigin is not liable for any indirect, incidental, or consequential damages arising from the use of our services or website. Our total liability is limited to the value of the specific order in question.",
            },
            {
              title: "Governing Law",
              content:
                "These terms are governed by the laws of the People's Republic of China. Any disputes shall be resolved through negotiation first, and if unsuccessful, through the appropriate courts or agreed arbitration.",
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

          <div className="bg-brand-light rounded-sm p-6 text-sm text-brand-steel">
            <p className="font-semibold text-brand-charcoal mb-1">Questions?</p>
            <p>
              Contact us at{" "}
              <span className="text-brand-copper font-medium">sourcing@steelneststore.com</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
