/**
 * GET /api/admin/settings — 获取全局设置
 * PUT /api/admin/settings — 更新全局设置
 */

import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import fs from "fs";
import path from "path";

const SETTINGS_FILE = path.join(process.cwd(), "src/data/settings.json");

function readSettings() {
  try {
    const raw = fs.readFileSync(SETTINGS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeSettings(settings: unknown) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), "utf-8");
}

export async function GET() {
  const settings = readSettings();
  return NextResponse.json(settings || {});
}

export async function PUT(request: Request) {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const current = readSettings();
    const updated = { ...current, ...body };
    writeSettings(updated);
    return NextResponse.json({ ok: true, settings: updated });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "保存失败" },
      { status: 500 }
    );
  }
}
