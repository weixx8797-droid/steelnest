import { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Request a Quote",
  description:
    "Request a quote from LabOrigin — lab-grown diamond sourcing, quality auditing, and white-label manufacturing direct from Henan, China.",
};

export default function ContactPage() {
  return (
    <div className="bg-brand-cream">
      <div className="container-page py-14 md:py-20">
        <div className="max-w-xl mb-12 space-y-3">
          <span className="font-serif italic text-brand-copper text-sm">
            Get in touch
          </span>
          <h1 className="font-serif text-4xl md:text-5xl text-brand-charcoal leading-tight">
            Request a quote
          </h1>
          <p className="text-brand-steel leading-relaxed">
            Tell us what you need — specs, quantities, and target market.
            We&apos;ll respond with pricing, lead times, and available stock
            within 24 hours.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-14">
          {/* 询价表单 */}
          <div>
            <ContactForm />
          </div>

          {/* 联系信息 */}
          <div className="space-y-10">
            <div>
              <h3 className="font-serif text-xl text-brand-charcoal mb-6">
                Other ways to reach us
              </h3>
              <div className="space-y-5">
                {[
                  { label: "Email", value: "sourcing@steelneststore.com" },
                  // TODO: 拿到真实 WhatsApp 号后再加回来，占位号码会让客户发到陌生人手机上
                  {
                    label: "Location",
                    value:
                      "Henan, China — the hub of lab-grown diamond production",
                  },
                  { label: "Response Time", value: "Within 24 hours (Mon–Fri)" },
                ].map((item) => (
                  <div key={item.label} className="space-y-1">
                    <p className="text-xs text-brand-steel">{item.label}</p>
                    <p className="text-sm text-brand-charcoal">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-brand-charcoal/10 pt-8">
              <h3 className="font-serif text-xl text-brand-charcoal mb-4">
                Bulk &amp; white-label programs
              </h3>
              <p className="text-sm text-brand-steel leading-relaxed">
                Interested in bulk sourcing or launching your own lab-grown
                diamond line? Reach out to us at{" "}
                <span className="text-brand-copper font-medium">
                  sourcing@steelneststore.com
                </span>{" "}
                with your requirements, and our team will get back to you with
                pricing, lead times, and available stock.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
