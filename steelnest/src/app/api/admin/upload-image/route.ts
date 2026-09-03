/**
 * POST /api/admin/upload-image — 产品图片上传
 * multipart/form-data，字段名 file。
 * 线上（有 BLOB_READ_WRITE_TOKEN）：图片存入 Vercel Blob（public），返回图片 URL。
 * 本地开发（无 token）：写入 public/uploads/，返回本地路径。
 */

import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { put } from "@vercel/blob";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB，低于 Vercel 4.5MB 请求体限制
const ALLOWED_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

export async function POST(request: Request) {
  const authed = await isAdminAuthenticated();
  if (!authed) return NextResponse.json({ error: "未登录" }, { status: 401 });

  try {
    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "请选择图片文件" }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "图片不能超过 3MB，请压缩后再试" },
        { status: 400 }
      );
    }

    const ext = ALLOWED_TYPES.get(file.type);
    if (!ext) {
      return NextResponse.json(
        { error: "仅支持 JPG / PNG / WebP / GIF 图片" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `products/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}.${ext}`;

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(filename, buffer, {
        access: "public",
        contentType: file.type,
      });
      return NextResponse.json({ ok: true, url: blob.url });
    }

    // 本地开发回退：保存到 public/uploads/
    const localPath = path.join(process.cwd(), "public", "uploads", filename);
    await mkdir(path.dirname(localPath), { recursive: true });
    await writeFile(localPath, buffer);
    return NextResponse.json({ ok: true, url: `/uploads/${filename}` });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "图片上传失败" },
      { status: 500 }
    );
  }
}