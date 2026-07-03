/**
 * POST /api/admin/ai-analyze — AI 分析产品图片
 *
 * 传一张产品图 → DeepSeek 分析 → 返回：
 *   - 产品名（英文）、一句话卖点
 *   - 建议分类、建议售价
 *   - 产品特点列表、长描述
 *   - 材质/尺寸推断
 *
 * 注意：DeepSeek v4 是文本模型，不支持直接图片输入
 * 这里让用户描述产品外观，AI 根据描述生成完整产品信息
 */

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image") as File | null;
    const userHint = formData.get("hint") as string | null;

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "未配置 DEEPSEEK_API_KEY" },
        { status: 400 }
      );
    }

    // 用用户提示构建 prompt（DeepSeek 文本模型不支持图片，但能根据描述生成）
    const hint = userHint || "a home organization product made of steel";

    const prompt = `You are an e-commerce product copywriter for SteelNest, a premium steel home organization brand.

Based on this brief product description: "${hint}"

Generate the following in JSON format. Make the copy compelling, professional, and optimized for US consumers.

Return ONLY valid JSON (no markdown):
{
  "name": "Product name in English (5-8 words max, include 'Steel' keyword)",
  "tagline": "One-line catchy tagline (10-15 words)",
  "category": "desk | storage | bathroom",
  "suggestedPrice": 29.99,
  "features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"],
  "description": "Full product description paragraph (80-120 words, highlight eco-friendly steel, recyclable, durability, tool-free assembly if applicable)",
  "specs": {
    "material": "e.g., Cold-Rolled Steel",
    "dimensions": "e.g., 32 × 22 × 28 cm",
    "weightCapacity": "e.g., 12 kg per tier",
    "weight": "e.g., 1.8 kg"
  },
  "colors": [
    { "name": "Charcoal Black", "hex": "#2D3436" },
    { "name": "Matte White", "hex": "#F5F5F0" }
  ],
  "seoKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
}`;

    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_MODEL || "deepseek-v4-pro",
        temperature: 0.7,
        max_tokens: 1500,
        messages: [
          {
            role: "system",
            content:
              "You are an expert e-commerce copywriter. Always output clean JSON only, no markdown formatting.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `DeepSeek API 错误: ${response.status}` },
        { status: 500 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // 清理 JSON
    let jsonStr = content.trim();
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/```json?\n?/g, "").replace(/```/g, "");
    }

    const productInfo = JSON.parse(jsonStr);

    // 确保必要字段存在
    return NextResponse.json({
      ok: true,
      product: {
        name: productInfo.name || hint,
        tagline: productInfo.tagline || "",
        category: productInfo.category || "desk",
        suggestedPrice: productInfo.suggestedPrice || 29.99,
        features: productInfo.features || [],
        description: productInfo.description || "",
        specs: productInfo.specs || {},
        colors: productInfo.colors || [
          { name: "Charcoal Black", hex: "#2D3436" },
        ],
        seoKeywords: productInfo.seoKeywords || [],
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "AI 分析失败" },
      { status: 500 }
    );
  }
}
