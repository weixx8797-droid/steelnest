/**
 * POST /api/admin/login — 管理后台登录 API
 */

import { NextResponse } from "next/server";
import { adminLogin } from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "密码不能为空" },
        { status: 400 }
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
