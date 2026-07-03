/**
 * GET /api/admin/settings/api-status — 检查各 API 密钥是否已配置
 */

import { NextResponse } from "next/server";

const TRACKED_KEYS = [
  "DEEPSEEK_API_KEY",
  "STRIPE_SECRET_KEY",
  "NEXT_PUBLIC_PAYPAL_CLIENT_ID",
  "RESEND_API_KEY",
  "REMOVE_BG_API_KEY",
  "REPLICATE_API_KEY",
  "GITHUB_TOKEN",
];

export async function GET() {
  const status: Record<string, boolean> = {};

  for (const key of TRACKED_KEYS) {
    const val = process.env[key];
    status[key] = Boolean(val && val.length > 0);
  }

  return NextResponse.json(status);
}
