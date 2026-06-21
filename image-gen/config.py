"""
============================================================
SteelNest AI 营销图生成 — 配置文件
============================================================
将供应商产品图自动转为品牌营销图
支持：去背景、场景生成、品牌风格叠加
============================================================
"""

import os

# ============================================================
# API 密钥 — 从环境变量读取，也支持本地 .env 文件
# ============================================================
try:
    from dotenv import load_dotenv
    from pathlib import Path
    env_file = Path(__file__).resolve().parent / ".env"
    if env_file.exists():
        load_dotenv(env_file)
    else:
        root_env = Path(__file__).resolve().parent.parent / ".env.local"
        if root_env.exists():
            load_dotenv(root_env)
except ImportError:
    pass

REMOVE_BG_API_KEY = os.environ.get("REMOVE_BG_API_KEY", "")
REPLICATE_API_KEY = os.environ.get("REPLICATE_API_KEY", "")

# ============================================================
# 品牌视觉配置
# ============================================================
BRAND = {
    "name": "SteelNest",
    "primary_color": "#C9A96E",      # Copper
    "secondary_color": "#2D3436",    # Charcoal
    "bg_color": "#FAFBFB",           # Cream white
    "font_style": "clean modern minimalist",
}

# ============================================================
# 输出尺寸配置（像素）
# ============================================================
OUTPUT_SIZES = {
    "thumbnail": (400, 400),      # 列表缩略图
    "detail": (1200, 1200),       # 详情大图
    "hero": (1920, 800),          # 首页 Hero 横幅
    "social_square": (1080, 1080), # Instagram Feed
    "social_vertical": (1080, 1920), # Story/TikTok
}

# ============================================================
# 生成风格模板
# ============================================================
STYLES = {
    "clean_white_bg": {
        "name": "干净白底电商图",
        "description": "去背景 + 纯白底 + 柔和阴影 + 产品居中",
        "steps": ["remove_bg", "composite_white"],
        "output_dir": "clean-white",
    },
    "lifestyle_scene": {
        "name": "生活场景图",
        "description": "产品放入现代简约家居/办公场景中",
        "steps": ["remove_bg", "replicate_scene"],
        "output_dir": "lifestyle",
        "replicate_prompt": """
Professional product photography of {product_name} placed in a modern minimalist {scene_type} interior.
Natural lighting, shallow depth of field, 8K resolution, commercial photography style.
Clean aesthetic, {brand_color} accent tones, marble and wood textures in background.
No text, no watermarks, no logos.
""",
    },
    "branded_style": {
        "name": "品牌风格图",
        "description": "叠加品牌色背景 + 铜色点缀 + Logo",
        "steps": ["remove_bg", "composite_brand"],
        "output_dir": "branded",
        "bg_color": BRAND["bg_color"],
        "accent_color": BRAND["primary_color"],
    },
}

# ============================================================
# 输出路径
# ============================================================
OUTPUT_BASE = "public/products/generated"
