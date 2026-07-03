"""
============================================================
SteelNest AI 营销图生成 — 主脚本
============================================================
用法：
    python generate.py --product "产品名" --image "原图路径" --style clean_white_bg
    python generate.py --product "产品名" --image "原图路径" --style all
    python generate.py --batch              # 批量处理 sourcing-queue 中的产品

输出：public/products/generated/ 下按风格分目录存放

API 依赖（按需安装）：
    pip install requests Pillow
    去背景：需要 remove.bg API Key（免费 50 张/月）
    场景生成：需要 Replicate API Key（~$0.03/张）
============================================================
"""

import os
import sys
import json
import time
import base64
import argparse
from pathlib import Path
from io import BytesIO
from typing import Optional

try:
    import requests
except ImportError:
    print("[ERROR] 缺少 requests 库，请运行: pip install requests")
    sys.exit(1)

try:
    from PIL import Image, ImageFilter, ImageDraw
except ImportError:
    print("[ERROR] 缺少 Pillow 库，请运行: pip install Pillow")
    sys.exit(1)

from config import (
    REMOVE_BG_API_KEY, REPLICATE_API_KEY,
    BRAND, OUTPUT_SIZES, STYLES, OUTPUT_BASE,
)

PROJECT_ROOT = Path(__file__).resolve().parent.parent


# ============================================================
# 1. 去背景（remove.bg API）
# ============================================================
def remove_background(image_path: str) -> Optional[Image.Image]:
    """调用 remove.bg API 去除背景，返回透明 PNG"""
    if not REMOVE_BG_API_KEY:
        print("[SKIP] 未设置 REMOVE_BG_API_KEY，跳过去背景")
        return None

    print(f"  [remove.bg] 去背景中...")
    try:
        with open(image_path, "rb") as f:
            response = requests.post(
                "https://api.remove.bg/v1.0/removebg",
                files={"image_file": f},
                data={"size": "auto"},
                headers={"X-Api-Key": REMOVE_BG_API_KEY},
                timeout=30,
            )
        if response.status_code == 200:
            return Image.open(BytesIO(response.content)).convert("RGBA")
        else:
            print(f"  [ERROR] remove.bg 返回 {response.status_code}: {response.text[:100]}")
            return None
    except Exception as e:
        print(f"  [ERROR] remove.bg 调用失败: {e}")
        return None


# ============================================================
# 2. 场景生成（Replicate API）
# ============================================================
def generate_scene(product_image: Image.Image, product_name: str, scene_type: str = "home office") -> Optional[Image.Image]:
    """使用 Replicate 的 Stable Diffusion 模型生成场景图"""
    if not REPLICATE_API_KEY:
        print("[SKIP] 未设置 REPLICATE_API_KEY，跳过场景生成")
        return None

    print(f"  [Replicate] 生成场景图中...")

    # 将产品图转为 base64
    buf = BytesIO()
    product_image.save(buf, format="PNG")
    img_b64 = base64.b64encode(buf.getvalue()).decode()

    prompt = STYLES["lifestyle_scene"]["replicate_prompt"].format(
        product_name=product_name,
        scene_type=scene_type,
        brand_color=BRAND["primary_color"],
    )

    try:
        # 使用 Replicate 的 img2img 模型
        response = requests.post(
            "https://api.replicate.com/v1/predictions",
            headers={
                "Authorization": f"Token {REPLICATE_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "version": "ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
                "input": {
                    "prompt": prompt,
                    "image": f"data:image/png;base64,{img_b64}",
                    "strength": 0.6,
                    "guidance_scale": 7.5,
                    "negative_prompt": "text, watermark, logo, low quality, blurry, distorted",
                },
            },
            timeout=30,
        )

        if response.status_code != 200 and response.status_code != 201:
            print(f"  [ERROR] Replicate 返回 {response.status_code}")
            return None

        prediction = response.json()
        prediction_id = prediction["id"]

        # 轮询等待生成完成
        for _ in range(30):  # 最多等 60 秒
            time.sleep(2)
            status_resp = requests.get(
                f"https://api.replicate.com/v1/predictions/{prediction_id}",
                headers={"Authorization": f"Token {REPLICATE_API_KEY}"},
                timeout=10,
            )
            status_data = status_resp.json()

            if status_data["status"] == "succeeded":
                output_url = status_data["output"][0] if isinstance(status_data["output"], list) else status_data["output"]
                img_resp = requests.get(output_url, timeout=30)
                return Image.open(BytesIO(img_resp.content)).convert("RGBA")
            elif status_data["status"] == "failed":
                print(f"  [ERROR] Replicate 生成失败: {status_data.get('error', 'unknown')}")
                return None

        print("  [WARN] Replicate 超时，跳过")
        return None

    except Exception as e:
        print(f"  [ERROR] Replicate 调用失败: {e}")
        return None


# ============================================================
# 3. 合成干净白底图
# ============================================================
def composite_white_bg(product_image: Image.Image, output_size: tuple = (1200, 1200)) -> Image.Image:
    """将透明 PNG 放到纯白背景上，加柔阴影"""
    print(f"  [合成] 生成白底电商图 {output_size[0]}×{output_size[1]}...")

    # 创建白色画布
    canvas = Image.new("RGBA", output_size, (250, 251, 251, 255))

    # 缩放产品图（留边距 15%）
    margin = int(min(output_size) * 0.15)
    max_w, max_h = output_size[0] - margin * 2, output_size[1] - margin * 2
    img_ratio = product_image.width / product_image.height

    if img_ratio > 1:
        new_w, new_h = max_w, int(max_w / img_ratio)
    else:
        new_h, new_w = max_h, int(max_h * img_ratio)

    resized = product_image.resize((new_w, new_h), Image.LANCZOS)

    # 添加柔和阴影（简单的底部阴影效果）
    shadow = Image.new("RGBA", (new_w + 20, new_h + 20), (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow)
    shadow_draw.ellipse([5, new_h - 10, new_w + 15, new_h + 15], fill=(0, 0, 0, 25))
    shadow = shadow.filter(ImageFilter.GaussianBlur(radius=8))

    # 粘贴阴影
    shadow_x = (output_size[0] - shadow.width) // 2
    shadow_y = (output_size[1] - shadow.height) // 2
    canvas.paste(shadow, (shadow_x, shadow_y), shadow)

    # 居中放置产品
    pos_x = (output_size[0] - new_w) // 2
    pos_y = (output_size[1] - new_h) // 2
    canvas.paste(resized, (pos_x, pos_y), resized)

    return canvas


# ============================================================
# 4. 品牌风格叠加
# ============================================================
def composite_brand_style(product_image: Image.Image, output_size: tuple = (1200, 1200)) -> Image.Image:
    """品牌色背景 + 产品居中 + 四周留品牌色边距"""
    print(f"  [合成] 生成品牌风格图 {output_size[0]}×{output_size[1]}...")

    style = STYLES["branded_style"]
    bg = Image.new("RGBA", output_size, style["bg_color"] + "FF")

    # 产品缩放到 70%
    max_size = int(min(output_size) * 0.7)
    img_ratio = product_image.width / product_image.height
    if img_ratio > 1:
        new_w, new_h = max_size, int(max_size / img_ratio)
    else:
        new_h, new_w = max_size, int(max_size * img_ratio)
    resized = product_image.resize((new_w, new_h), Image.LANCZOS)

    # 底部铜色装饰条
    draw = ImageDraw.Draw(bg)
    bar_height = 4
    bar_y = output_size[1] - 60
    draw.rectangle([output_size[0]//4, bar_y, output_size[0]*3//4, bar_y + bar_height], fill=style["accent_color"] + "FF")

    # 居中放置
    pos_x = (output_size[0] - new_w) // 2
    pos_y = (output_size[1] - new_h) // 2 - 30
    bg.paste(resized, (pos_x, pos_y), resized)

    return bg


# ============================================================
# 5. 多尺寸输出
# ============================================================
def save_multi_size(img: Image.Image, base_name: str, output_dir: Path) -> list[str]:
    """保存多种尺寸版本，返回文件路径列表"""
    saved = []
    for size_name, dimensions in OUTPUT_SIZES.items():
        resized = img.copy()
        resized.thumbnail(dimensions, Image.LANCZOS)

        # 如果尺寸不够，创建对应比例画布居中放置
        if resized.size != dimensions:
            canvas = Image.new("RGBA", dimensions, (255, 255, 255, 255))
            px = (dimensions[0] - resized.width) // 2
            py = (dimensions[1] - resized.height) // 2
            canvas.paste(resized, (px, py), resized if resized.mode == "RGBA" else None)
            resized = canvas

        # 保存为 JPG（白底图）或 PNG（透明图）
        if resized.mode == "RGBA":
            # 转 RGB 保存为 JPG
            jpg_img = Image.new("RGB", resized.size, (255, 255, 255))
            jpg_img.paste(resized, (0, 0), resized)
            filepath = output_dir / f"{base_name}_{size_name}.jpg"
            jpg_img.save(filepath, "JPEG", quality=90)
        else:
            filepath = output_dir / f"{base_name}_{size_name}.jpg"
            resized.save(filepath, "JPEG", quality=90)

        saved.append(str(filepath.relative_to(PROJECT_ROOT)))
        print(f"  [OK] {filepath.relative_to(PROJECT_ROOT)}")

    return saved


# ============================================================
# 6. 主函数：生成单张营销图
# ============================================================
def generate_marketing_image(
    product_name: str,
    source_image_path: str,
    style: str = "clean_white_bg",
) -> dict:
    """为一个产品生成营销图"""
    print(f"\n{'='*50}")
    print(f"[GEN] {product_name}")
    print(f"  原图: {source_image_path}")
    print(f"  风格: {style}")
    print(f"{'='*50}")

    result = {
        "product": product_name,
        "style": style,
        "images": [],
        "error": None,
    }

    # 加载原图
    try:
        original = Image.open(source_image_path).convert("RGBA")
    except Exception as e:
        result["error"] = f"无法打开图片: {e}"
        print(f"  [ERROR] {result['error']}")
        return result

    # 去背景
    no_bg = remove_background(source_image_path)
    if no_bg is None:
        no_bg = original  # 失败则用原图

    # 根据风格处理
    if style == "clean_white_bg":
        final_img = composite_white_bg(no_bg)
    elif style == "lifestyle_scene":
        scene = generate_scene(no_bg, product_name)
        final_img = scene if scene else composite_white_bg(no_bg)
    elif style == "branded_style":
        final_img = composite_brand_style(no_bg)
    elif style == "all":
        # 生成所有风格
        results = []
        for s in ["clean_white_bg", "lifestyle_scene", "branded_style"]:
            r = generate_marketing_image(product_name, source_image_path, s)
            results.append(r)
        return {
            "product": product_name,
            "style": "all",
            "images": [img for r in results for img in r.get("images", [])],
            "error": None,
        }
    else:
        final_img = composite_white_bg(no_bg)

    # 保存多尺寸
    safe_name = product_name.lower().replace(" ", "-")[:30]
    output_dir = PROJECT_ROOT / OUTPUT_BASE / STYLES[style]["output_dir"]
    output_dir.mkdir(parents=True, exist_ok=True)

    result["images"] = save_multi_size(final_img, safe_name, output_dir)
    return result


# ============================================================
# 7. 批量处理
# ============================================================
def batch_generate(sourcing_file: str = "src/data/sourcing-queue.json") -> list[dict]:
    """读取铺货队列，批量生成营销图"""
    queue_path = PROJECT_ROOT / sourcing_file
    if not queue_path.exists():
        print(f"[ERROR] 铺货队列文件不存在: {queue_path}")
        return []

    with open(queue_path, "r", encoding="utf-8") as f:
        queue = json.load(f)

    items = [q for q in queue if q.get("status") == "approved"]
    if not items:
        print("[INFO] 铺货队列中没有待处理的审批产品")
        return []

    results = []
    for item in items:
        if item.get("images") and len(item["images"]) > 0:
            source_img = PROJECT_ROOT / "public" / item["images"][0]
            if source_img.exists():
                r = generate_marketing_image(
                    item.get("englishName", item.get("quoteId", "product")),
                    str(source_img),
                    style="all",
                )
                results.append(r)
                # 更新队列状态
                item["marketingImages"] = r.get("images", [])
                item["marketingGenerated"] = True

    # 保存更新后的队列
    with open(queue_path, "w", encoding="utf-8") as f:
        json.dump(queue, f, ensure_ascii=False, indent=2)

    return results


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="SteelNest AI 营销图生成工具")
    parser.add_argument("--product", type=str, help="产品名称")
    parser.add_argument("--image", type=str, help="原图路径")
    parser.add_argument("--style", type=str, default="clean_white_bg",
                       choices=["clean_white_bg", "lifestyle_scene", "branded_style", "all"],
                       help="风格模板")
    parser.add_argument("--batch", action="store_true", help="批量处理铺货队列")

    args = parser.parse_args()

    if args.batch:
        results = batch_generate()
        print(f"\n[完成] 批量生成 {len(results)} 个产品的营销图")
    elif args.product and args.image:
        generate_marketing_image(args.product, args.image, args.style)
    else:
        print("\n用法示例：")
        print("  python generate.py --product 'Steel Desk Rack' --image 'public/products/desk-rack.jpg' --style clean_white_bg")
        print("  python generate.py --product 'Steel Desk Rack' --image 'public/products/desk-rack.jpg' --style all")
        print("  python generate.py --batch")
