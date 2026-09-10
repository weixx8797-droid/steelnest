"use client";

import { useState, useEffect } from "react";

const INTERESTS = [
  "Loose diamonds",
  "Finished jewelry / settings",
  "White-label / dropshipping",
  "Bulk / parcel program",
  "Quality auditing",
];

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    market: "",
    whatsapp: "",
    interest: INTERESTS[0],
    quantity: "",
    message: "",
  });
  const [product, setProduct] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [error, setError] = useState("");

  // 从 URL 读取 product 参数（产品详情页「Request a Quote」跳转带 ?product=slug）
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setProduct(params.get("product") || "");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, product: product || undefined }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "提交失败");
      }
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "网络错误，请稍后再试");
    }
  };

  if (status === "sent") {
    return (
      <div className="text-center py-12 space-y-4">
        <span className="text-5xl">💎</span>
        <h3 className="text-xl font-bold text-brand-charcoal">
          Quote Request Received
        </h3>
        <p className="text-brand-steel max-w-sm mx-auto">
          Thank you for reaching out. We&apos;ll reply by email and WhatsApp
          within 24 hours with pricing, lead times, and available stock.
        </p>
        <button
          onClick={() => {
            setStatus("idle");
            setForm({
              name: "",
              company: "",
              email: "",
              market: "",
              whatsapp: "",
              interest: INTERESTS[0],
              quantity: "",
              message: "",
            });
          }}
          className="text-sm font-semibold text-brand-copper hover:underline"
        >
          Send Another Request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-brand-charcoal">
            Contact Name *
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-brand-copper transition-colors"
            placeholder="Your name"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-brand-charcoal">
            Company / Studio *
          </label>
          <input
            type="text"
            required
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-brand-copper transition-colors"
            placeholder="Your company"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-brand-charcoal">
            Email *
          </label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-brand-copper transition-colors"
            placeholder="you@example.com"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-brand-charcoal">
            WhatsApp *
          </label>
          <input
            type="text"
            required
            value={form.whatsapp}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-brand-copper transition-colors"
            placeholder="+1 234 567 8900"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-brand-charcoal">
            Main Market *
          </label>
          <input
            type="text"
            required
            value={form.market}
            onChange={(e) => setForm({ ...form, market: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-brand-copper transition-colors"
            placeholder="e.g. US, EU, Middle East, AU"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-brand-charcoal">
            What are you looking for?
          </label>
          <select
            value={form.interest}
            onChange={(e) => setForm({ ...form, interest: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-brand-copper transition-colors bg-white"
          >
            {INTERESTS.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-brand-charcoal">
          Estimated Quantity
        </label>
        <input
          type="text"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          className="w-full px-4 py-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-brand-copper transition-colors"
          placeholder="e.g. 50 stones / month"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-brand-charcoal">
          Your Requirements *
        </label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full px-4 py-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-brand-copper transition-colors resize-none"
          placeholder="Tell us the specs, shapes, carat weights, colors, and target price you need..."
        />
      </div>

      {status === "error" && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={status === "sending"}
        className="px-8 py-3 bg-brand-copper text-white text-sm font-semibold rounded-md hover:bg-[#A8863D] transition-colors disabled:opacity-50"
      >
        {status === "sending" ? "Sending..." : "Submit Request"}
      </button>
    </form>
  );
}
