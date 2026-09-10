/**
 * 询盘（RFQ）读写工具
 * 数据源：
 *  - 线上（Vercel）：Vercel Blob 存储，路径 "inquiries.json"（需要环境变量 BLOB_READ_WRITE_TOKEN）
 *  - 本地开发：src/data/inquiries.json（无 token 时自动回退到本地文件）
 */

import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { get, put } from "@vercel/blob";

export interface Inquiry {
  id: string;
  name: string;
  company: string;
  email: string;
  market: string;
  interest: string;
  quantity: string;
  whatsapp?: string;
  product?: string;
  message: string;
  createdAt: string;
}

const INQUIRIES_FILE = path.join(process.cwd(), "src/data/inquiries.json");
const BLOB_PATH = "inquiries.json";

// 线上（Vercel）通过 BLOB_READ_WRITE_TOKEN 自动启用 Blob；本地开发没有该变量则回退到本地文件
const BLOB_ENABLED = !!process.env.BLOB_READ_WRITE_TOKEN;

/** 从本地 JSON 文件读取询盘列表 */
function readFromFile(): Inquiry[] {
  try {
    const raw = readFileSync(INQUIRIES_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** 从 Vercel Blob 读取询盘列表；Blob 为空（首次上线）或读取失败时回退到打包的本地文件 */
async function readFromBlob(): Promise<Inquiry[]> {
  try {
    const result = await get(BLOB_PATH, { access: "private" });
    if (!result || result.statusCode !== 200) return readFromFile();
    const text = await new Response(result.stream).text();
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : readFromFile();
  } catch {
    return readFromFile();
  }
}

/** 读取询盘列表（Blob 优先，本地文件回退） */
export async function readInquiries(): Promise<Inquiry[]> {
  return BLOB_ENABLED ? readFromBlob() : readFromFile();
}

/** 追加一条询盘并写回存储 */
export async function addInquiry(inquiry: Inquiry): Promise<void> {
  const all = await readInquiries();
  all.push(inquiry);
  const json = JSON.stringify(all, null, 2);
  if (BLOB_ENABLED) {
    await put(BLOB_PATH, json, {
      access: "private",
      contentType: "application/json",
      allowOverwrite: true,
    });
  } else {
    writeFileSync(INQUIRIES_FILE, json, "utf-8");
  }
}
