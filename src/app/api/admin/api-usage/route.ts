/**
 * GET /api/admin/api-usage — 获取 API 用量统计数据
 */

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const USAGE_FILE = path.join(process.cwd(), "src/data/api-usage.json");

function readUsage() {
  try {
    return JSON.parse(fs.readFileSync(USAGE_FILE, "utf-8"));
  } catch {
    return { records: [], summary: {} };
  }
}

export async function GET() {
  const usage = readUsage();

  // 计算预估月费
  const summary = usage.summary || {};
  const monthlyEstimate = {
    openai: (summary.openai?.estimatedCost || 0) * 30,
    imageApi: (summary.imageApi?.estimatedCost || 0) * 30,
    total: ((summary.openai?.estimatedCost || 0) + (summary.imageApi?.estimatedCost || 0)) * 30,
  };

  return NextResponse.json({
    ...usage,
    monthlyEstimate,
    updatedAt: new Date().toISOString(),
  });
}
