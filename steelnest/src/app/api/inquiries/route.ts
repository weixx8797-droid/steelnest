/**
 * POST /api/inquiries — 接收询价（RFQ）
 * 写入 Vercel Blob / 本地 inquiries.json，并发送通知邮件
 */

import { NextResponse } from "next/server";
import { addInquiry, type Inquiry } from "@/lib/inquiries";
import { sendEmail } from "@/lib/email";

/** 简单 HTML 转义，防止用户输入注入邮件 HTML */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = (body.name || "").toString().trim();
    const email = (body.email || "").toString().trim();
    const whatsapp = (body.whatsapp || "").toString().trim();
    const message = (body.message || "").toString().trim();

    if (!name || !email || !whatsapp || !message) {
      return NextResponse.json(
        { error: "请填写姓名、邮箱、WhatsApp 和需求描述" },
        { status: 400 }
      );
    }

    const inquiry: Inquiry = {
      id: `inq-${Date.now()}`,
      name,
      company: (body.company || "").toString().trim(),
      email,
      market: (body.market || "").toString().trim(),
      interest: (body.interest || "Loose diamonds").toString().trim(),
      quantity: (body.quantity || "").toString().trim(),
      whatsapp: whatsapp || undefined,
      product: body.product || undefined,
      message,
      createdAt: new Date().toISOString(),
    };

    // 写入存储（线上走 Blob，本地走文件）
    await addInquiry(inquiry);

    // 转义所有用户输入后再拼进 HTML
    const e = {
      name: escapeHtml(inquiry.name),
      company: escapeHtml(inquiry.company),
      email: escapeHtml(inquiry.email),
      market: escapeHtml(inquiry.market),
      interest: escapeHtml(inquiry.interest),
      quantity: escapeHtml(inquiry.quantity),
      whatsapp: escapeHtml(inquiry.whatsapp || ""),
      product: escapeHtml(inquiry.product || ""),
      message: escapeHtml(inquiry.message),
    };

    const html = `<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1A1A1A;">
  <h2 style="color:#1A1A1A;">New quote request</h2>
  <table style="width:100%; font-size:14px; line-height:1.8;">
    <tr><td><strong>Name</strong></td><td>${e.name}</td></tr>
    <tr><td><strong>Company</strong></td><td>${e.company || "—"}</td></tr>
    <tr><td><strong>Email</strong></td><td>${e.email}</td></tr>
    <tr><td><strong>WhatsApp</strong></td><td>${e.whatsapp || "—"}</td></tr>
    <tr><td><strong>Main Market</strong></td><td>${e.market || "—"}</td></tr>
    <tr><td><strong>Interest</strong></td><td>${e.interest}</td></tr>
    <tr><td><strong>Quantity</strong></td><td>${e.quantity || "—"}</td></tr>
    ${e.product ? `<tr><td><strong>Product</strong></td><td>${e.product}</td></tr>` : ""}
  </table>
  <p style="color:#333;">${e.message}</p>
</body>
</html>`;

    // 1) 通知站长（用 INQUIRY_NOTIFY_EMAIL 环境变量配置）
    const notifyEmail = process.env.INQUIRY_NOTIFY_EMAIL;
    if (notifyEmail) {
      try {
        await sendEmail({
          to: notifyEmail,
          subject: `[LabOrigin] 新询盘：${inquiry.name} — ${inquiry.interest}`,
          html,
        });
      } catch (error) {
        // 邮件失败不影响询盘：数据已写入存储，后台仍可看到
        console.error("[inquiries] 站长通知邮件发送失败：", error);
      }
    } else {
      console.log(
        "[inquiries] 未配置 INQUIRY_NOTIFY_EMAIL，跳过站长通知；询盘已写入存储。"
      );
    }

    // 2) 给客户发确认信（未配置 senderEmail 时 Resend 只能用测试发件人，可能无法送达）
    try {
      await sendEmail({
        to: email,
        subject: `Your LabOrigin quote request has been received`,
        html: `<p>Hi ${e.name},</p><p>We&apos;ve received your request and will reply within 24 hours.</p>`,
      });
    } catch (error) {
      console.error("[inquiries] 客户确认邮件发送失败：", error);
    }

    return NextResponse.json({ ok: true, inquiry });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "提交失败" },
      { status: 500 }
    );
  }
}
