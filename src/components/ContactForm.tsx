"use client";

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 后续接入 Resend 或第三方表单服务（如 Formspree）
    // 现在先显示成功提示
    setSent(true);
  };

  if (sent) {
    return (
      <div className="text-center py-12 space-y-4">
        <span className="text-5xl">📬</span>
        <h3 className="text-xl font-bold text-brand-charcoal">Message Sent!</h3>
        <p className="text-brand-steel">
          Thank you for reaching out. We&apos;ll get back to you within 24 hours.
        </p>
        <button
          onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
          className="text-sm font-semibold text-brand-copper hover:underline"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-brand-charcoal">Name *</label>
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
          <label className="text-sm font-medium text-brand-charcoal">Email *</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-brand-copper transition-colors"
            placeholder="you@example.com"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-brand-charcoal">Subject</label>
        <input
          type="text"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          className="w-full px-4 py-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-brand-copper transition-colors"
          placeholder="How can we help?"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-brand-charcoal">Message *</label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full px-4 py-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-brand-copper transition-colors resize-none"
          placeholder="Tell us what you need..."
        />
      </div>
      <button
        type="submit"
        className="px-8 py-3 bg-brand-copper text-white text-sm font-semibold rounded-md hover:bg-[#B8953E] transition-colors"
      >
        Send Message
      </button>
    </form>
  );
}
