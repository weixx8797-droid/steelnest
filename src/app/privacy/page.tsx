import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "SteelNest privacy policy — how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-white">
      <div className="container-page py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-charcoal mb-2">
          Privacy Policy
        </h1>
        <p className="text-brand-steel mb-10">Last updated: June 2026</p>

        <div className="max-w-3xl space-y-10">
          {[
            {
              title: "Information We Collect",
              content:
                "When you place an order or contact us, we collect the information you provide: name, email address, shipping address, and payment details. Payment information (credit card numbers) is processed securely by Stripe and PayPal — we never store your full payment details on our servers.",
            },
            {
              title: "How We Use Your Information",
              content: "",
              list: [
                "To process and fulfill your orders",
                "To send order confirmations and shipping updates via email",
                "To respond to your customer service inquiries",
                "To improve our website and product offerings",
                "We do not sell, trade, or rent your personal information to third parties",
              ],
            },
            {
              title: "Cookies",
              content:
                "Our website uses essential cookies for core functionality (shopping cart, checkout). We also use Google Analytics to understand how visitors use our site. You can disable cookies in your browser settings, though this may affect site functionality.",
            },
            {
              title: "Third-Party Services",
              content:
                "We use trusted third-party services to operate our business: Stripe and PayPal (payment processing), Resend (email delivery), and Google Analytics (site analytics). Each provider has its own privacy policy governing how they handle your data.",
            },
            {
              title: "Data Retention",
              content:
                "We retain order information for as long as necessary to fulfill your order and comply with legal obligations. You can request deletion of your personal data at any time by contacting us.",
            },
            {
              title: "Your Rights",
              content:
                "You have the right to access, correct, or delete your personal data. You can also opt out of marketing communications at any time. To exercise these rights, contact us at privacy@steelnest.com.",
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
            <p className="font-semibold text-brand-charcoal mb-1">Contact</p>
            <p>
              For privacy-related inquiries:{" "}
              <span className="text-brand-copper font-medium">privacy@steelnest.com</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
