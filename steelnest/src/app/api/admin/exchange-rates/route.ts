/**
 * GET /api/admin/exchange-rates — 获取最新汇率
 * POST /api/admin/exchange-rates — 手动刷新汇率（从 Frankfurter API）
 */

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const RATES_FILE = path.join(process.cwd(), "src/data/exchange-rates.json");

function readRates() {
  try {
    return JSON.parse(fs.readFileSync(RATES_FILE, "utf-8"));
  } catch {
    return { base: "USD", rates: { CNY: 7.25 }, updatedAt: "", source: "error" };
  }
}

function writeRates(data: unknown) {
  fs.writeFileSync(RATES_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET() {
  const rates = readRates();
  return NextResponse.json(rates);
}

export async function POST() {
  try {
    // 调用 Frankfurter 免费汇率 API（无需注册）
    const res = await fetch(
      "https://api.frankfurter.app/latest?from=USD&to=CNY,EUR,GBP,JPY,CAD,AUD",
      { next: { revalidate: 0 } }
    );

    if (!res.ok) throw new Error(`API error: ${res.status}`);

    const data = await res.json();
    const rates = {
      base: "USD",
      rates: data.rates,
      updatedAt: data.date + "T12:00:00Z",
      source: "frankfurter",
    };

    writeRates(rates);
    return NextResponse.json({ ok: true, rates });
  } catch (error) {
    // 失败时返回本地缓存
    const cached = readRates();
    return NextResponse.json(
      { ok: false, rates: cached, error: String(error) },
      { status: 200 }
    );
  }
}
