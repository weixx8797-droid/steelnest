import { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with SteelNest. We're here to help with any questions about our steel organizers.",
};

export default function ContactPage() {
  return (
    <div className="bg-white">
      <div className="container-page py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-charcoal mb-2">
          Contact Us
        </h1>
        <p className="text-brand-steel mb-10 max-w-lg">
          Have questions about our products, shipping, or anything else?
          We&apos;d love to hear from you.
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* 联系表单 */}
          <div>
            <ContactForm />
          </div>

          {/* 联系信息 */}
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-bold text-brand-charcoal mb-4">
                Other Ways to Reach Us
              </h3>
              <div className="space-y-4">
                {[
                  { icon: "📧", label: "Email", value: "hello@steelnest.com" },
                  { icon: "📍", label: "Factory", value: "Pangcun Town, Luoyang, Henan, China" },
                  { icon: "🕐", label: "Response Time", value: "Within 24 hours (Mon–Fri)" },
                ].map((item) => (
                  <div key={item.label} className="flex gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <p className="text-xs text-brand-steel">{item.label}</p>
                      <p className="text-sm font-medium text-brand-charcoal">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-brand-charcoal mb-4">
                For Wholesale Inquiries
              </h3>
              <p className="text-sm text-brand-steel leading-relaxed">
                Interested in bulk orders or becoming a distributor?
                Reach out to us at{" "}
                <span className="text-brand-copper font-medium">
                  wholesale@steelnest.com
                </span>{" "}
                with your requirements, and our team will get back to you with
                pricing and lead times.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
