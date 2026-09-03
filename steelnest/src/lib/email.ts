/**
 * 邮件发送工具（Resend）
 * 用 fetch 调 Resend HTTP API，不额外引入 npm 依赖。
 * 未配置 RESEND_API_KEY 时降级为 console.log（方便本地测试流程）。
 */

import { readFileSync } from "fs";
import path from "path";
import type { Order } from "@/lib/orders";

const SETTINGS_FILE = path.join(process.cwd(), "src/data/settings.json");

function getSettingsEmail(): { senderName: string; senderEmail: string } {
  try {
    const raw = readFileSync(SETTINGS_FILE, "utf-8");
    const settings = JSON.parse(raw);
    return {
      senderName: settings?.email?.senderName || "SteelNest",
      senderEmail: settings?.email?.senderEmail || "",
    };
  } catch {
    return { senderName: "SteelNest", senderEmail: "" };
  }
}

interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
}

/** 发送邮件（未配 key 时降级为日志） */
export async function sendEmail({ to, subject, html }: SendEmailInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const { senderName, senderEmail } = getSettingsEmail();
  // 正式环境需验证域名；未配置时用 Resend 测试发件人
  const from = senderEmail
    ? `${senderName} <${senderEmail}>`
    : `${senderName} <onboarding@resend.dev>`;

  if (!apiKey) {
    console.log("\n===== [邮件降级] 未配置 RESEND_API_KEY，仅打印不发 =====\n");
    console.log(`From:    ${from}`);
    console.log(`To:      ${to}`);
    console.log(`Subject: ${subject}`);
    console.log("---- HTML ----");
    console.log(html);
    console.log("=====================================================\n");
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ from, to, subject, html }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Resend 发送失败: ${res.status} ${text}`);
  }
}

/** 发送"已发货 + 物流单号"通知邮件 */
export async function sendShipmentEmail(order: Order): Promise<void> {
  const itemsHtml = order.items
    .map(
      (i) =>
        `<li>${i.productName}（${i.color}）× ${i.quantity} — $${(
          i.unitPrice * i.quantity
        ).toFixed(2)}</li>`
    )
    .join("");

  const html = `<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #2D3436;">
  <h2 style="color: #1a1f20;">Your SteelNest order is on its way! 🚚</h2>
  <p>Hi,</p>
  <p>Good news — your order <strong>${order.orderNumber}</strong> has shipped.</p>

  ${
    order.trackingNumber
      ? `<div style="background:#f5f5f0; padding:12px 16px; border-radius:8px; margin:16px 0;">
           <strong>Tracking number:</strong> ${order.trackingNumber}${
           order.carrier ? ` &nbsp;(${order.carrier})` : ""
         }
         </div>`
      : ""
  }

  <h3 style="margin-bottom:8px;">Items in this order:</h3>
  <ul style="line-height:1.8;">${itemsHtml}</ul>

  <p>Shipping to: ${order.shippingAddress.name}, ${order.shippingAddress.line1}, ${order.shippingAddress.city}${
    order.shippingAddress.state ? ", " + order.shippingAddress.state : ""
  } ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}</p>

  <p>Typical international delivery takes 7–14 business days.</p>
  <p style="color:#666;">Thank you for choosing steel over wood. 🌿<br/>— The SteelNest Team</p>
</body>
</html>`;

  await sendEmail({
    to: order.customerEmail,
    subject: `Your SteelNest order ${order.orderNumber} has shipped`,
    html,
  });
}
