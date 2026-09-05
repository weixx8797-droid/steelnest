/**
 * GET /api/admin/exchange-rates — 获取最新汇率
 * POST /api/admin/exchange-rates — 手动刷新汇率（从 Frankfurter API）
 * 线上持久化到 Vercel Blob（exchange-rates.json），本地开发回退 src/data/exchange-rates.json
 */

import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { get, put } from "@vercel/blob";
import { readFileSync, writeFileSync } from "fs";
import path from "path";

interface RatesData {
  base: string;
  rates: Record<string, number>;
  updatedAt: string;
  source: string;
}

const RATES_FILE = path.join(process.cwd(), "src/data/exchange-rates.json");
const BLOB_PATH = "exchange-rates.json";
const BLOB_ENABLED = !!process.env.BLOB_READ_WRITE_TOKEN;

function fallbackRates(): RatesData {
  return { base: "USD", rates: { CNY: 7.25 }, updatedAt: "", source: "error" };
}

function readFromFile(): RatesData {
  try {
    const parsed = JSON.parse(readFileSync(RATES_FILE, "utf-8"));
    return parsed as RatesData;
  } catch {
    return fallbackRates();
  }
}

/** 从 Vercel Blob 读取汇率；Blob 为空或读取失败时回退本地文件 */
async function readFromBlob(): Promise<RatesData> {
  try {
    const result = await get(BLOB_PATH, { access: "private" });
    if (!result || result.statusCode !== 200) return readFromFile();
    const text = await new Response(result.stream).text();
    return JSON.parse(text) as RatesData;
  } catch {
    return readFromFile();
  }
}

async function readRates(): Promise<RatesData> {
  return BLOB_ENABLED ? readFromBlob() : readFromFile();
}

async function writeRates(data: RatesData): Promise<void> {
  const json = JSON.stringify(data, null, 2);
  if (BLOB_ENABLED) {
    await put(BLOB_PATH, json, {
      access: "private",
      contentType: "application/json",
      allowOverwrite: true,
    });
  } else {
    writeFileSync(RATES_FILE, json, "utf-8");
  }
}

export async function GET() {
  const rates = await readRates();
  return NextResponse.json(rates);
}

export async function POST() {
  const authed = await isAdminAuthenticated();
  if (!authed) return NextResponse.json({ error: "未登录" }, { status: 401 });

  try {
    // 调用 Frankfurter 免费汇率 API（无需注册，数据每日更新）
    const res = await fetch(
      "https://api.frankfurter.app/latest?from=USD&to=CNY,EUR,GBP,JPY,CAD,AUD",
      { next: { revalidate: 0 } }
    );

    if (!res.ok) throw new Error(`API error: ${res.status}`);

    const data = await res.json();
    const rates: RatesData = {
      base: "USD",
      rates: data.rates,
      updatedAt: data.date + "T12:00:00Z",
      source: "frankfurter",
    };

    await writeRates(rates);
    return NextResponse.json({ ok: true, rates });
  } catch (error) {
    // 失败时返回本地缓存
    const cached = await readRates();
    return NextResponse.json(
      { ok: false, rates: cached, error: String(error) },
      { status: 200 }
    );
  }
}