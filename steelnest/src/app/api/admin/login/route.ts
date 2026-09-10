/**
 * POST /api/admin/login — 管理后台登录 API
 */

import { NextResponse } from "next/server";
import { adminLogin, isAdminPasswordConfigured } from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "密码不能为空" },
        { status: 400 }
      );
    }

    if (!isAdminPasswordConfigured()) {
      return NextResponse.json(
        {
          error:
            "后台密码未配置：请在 Vercel 环境变量里新增 ADMIN_PASSWORD 并重新部署后再登录",
        },
        { status: 503 }
      );
    }

    const success = await adminLogin(password);

    if (success) {
      return NextResponse.json({ ok: true });
    } else {
      return NextResponse.json(
        { error: "密码错误" },
        { status: 401 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: "服务器错误" },
      { status: 500 }
    );
  }
}
