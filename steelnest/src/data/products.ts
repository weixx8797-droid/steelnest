/**
 * SteelNest 产品数据库
 * 新增产品：直接在这个数组里添加一个对象即可
 * 产品图片：放在 public/products/ 文件夹，引用路径 /products/xxx.jpg
 */

export interface Product {
  slug: string; // URL 用的唯一标识（英文短横线）
  name: string;
  tagline: string;
  price: number; // 美元
  originalPrice?: number; // 划线原价（有打折时用）
  category: "desk" | "storage" | "bathroom";
  images: string[]; // 产品图片路径，第一张是主图
  specs: {
    material: string;
    dimensions: string;
    weightCapacity: string;
    weight?: string;
  };
  colors: { name: string; hex: string }[];
  features: string[]; // 卖点列表
  description: string; // 长描述
  inStock: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  discount?: string; // 折扣标签文字，如 "20% OFF"
}

export const products: Product[] = [
  {
    slug: "desktop-multi-layer-steel-storage-organizer",
    name: "Desktop Multi-Layer Steel Storage Organizer",
    tagline:
      "DIY snap-fit cold-rolled steel desktop shelf — tame your desk clutter, from stationery to skincare.",
    price: 29.99,
    category: "desk",
    images: [
      "/products/desk-organizer-01.svg",
      "/products/desk-organizer-02.svg",
    ],
    specs: {
      material: "Reinforced Cold-Rolled Steel",
      dimensions: "32 × 22 × 28 cm (12.6 × 8.7 × 11 inch)",
      weightCapacity: "12 kg (26.5 lbs) per tier",
      weight: "1.8 kg (4 lbs)",
    },
    colors: [
      { name: "Charcoal Black", hex: "#2D3436" },
      { name: "Matte White", hex: "#F5F5F0" },
    ],
    features: [
      "Tool-free snap-lock assembly — set up in under 2 minutes",
      "Rust-resistant electrostatic spray coating",
      "Modular: add or remove tiers anytime",
      "100% recyclable steel — zero plastic",
      "Anti-slip rubber feet protect your desk surface",
    ],
    description:
      "Reclaim your workspace with the SteelNest Desktop Organizer. Made from reinforced cold-rolled steel with our signature rust-proof coating, this modular shelf stacks vertically to adapt to your needs. Whether it\'s office stationery, makeup brushes, or craft supplies — everything finds its place. And when you no longer need it, the steel returns to the earth, not a landfill.",
    inStock: true,
    isNew: true,
    discount: "NEW",
  },
  {
    slug: "bathroom-wall-mount-steel-shower-caddy",
    name: "Bathroom Wall Mount Steel Shower Caddy",
    tagline:
      "Wall-mounted bathroom organizer — moisture-proof steel that keeps your essentials dry and within reach.",
    price: 36.99,
    category: "bathroom",
    images: [
      "/products/bathroom-caddy-01.svg",
      "/products/bathroom-caddy-02.svg",
    ],
    specs: {
      material: "One-Piece Formed Cold-Rolled Steel",
      dimensions: "40 × 15 × 30 cm (15.7 × 5.9 × 11.8 inch)",
      weightCapacity: "20 kg (44 lbs) total",
      weight: "1.5 kg (3.3 lbs)",
    },
    colors: [
      { name: "Matte White", hex: "#F5F5F0" },
      { name: "Gunmetal Gray", hex: "#4A4F52" },
    ],
    features: [
      "No-drill adhesive mounting (screw option included)",
      "Hollow-grid drainage keeps items dry and mold-free",
      "Multi-tier compartments for bottles, razors, and soap",
      "100% recyclable rust-proof steel construction",
      "Fits standard bathroom tile, glass, and drywall",
    ],
    description:
      "Bathrooms are where steel truly shines — unlike wood or plastic organizers that warp in humidity, the SteelNest Shower Caddy is built from one-piece formed cold-rolled steel, finished with a moisture-sealed coating. The open-grid base lets water drain instantly, preventing the damp buildup that leads to mold. Mount it without drilling, or use the included screws for permanent placement. From shampoo bottles to razors, everything stays organized and dry.",
    inStock: true,
    isBestseller: true,
  },
  {
    slug: "stackable-diy-steel-storage-cube-organizer",
    name: "Stackable DIY Steel Storage Cube Organizer",
    tagline:
      "Snap-together modular steel cubes — build your own closet, pantry, or garage storage wall.",
    price: 54.99,
    category: "storage",
    images: [
      "/products/storage-cube-01.svg",
      "/products/storage-cube-02.svg",
    ],
    specs: {
      material: "Heavy-Gauge Cold-Rolled Steel Plate",
      dimensions: "35 × 35 × 35 cm per cube (13.8 × 13.8 × 13.8 inch)",
      weightCapacity: "25 kg (55 lbs) per cube",
      weight: "3.2 kg (7 lbs) per cube",
    },
    colors: [
      { name: "Charcoal Black", hex: "#2D3436" },
      { name: "Cream White", hex: "#FAFBFB" },
    ],
    features: [
      "DIY modular: connect cubes horizontally or vertically",
      "Flat-pack foldable design for efficient shipping",
      "100% recyclable steel with scratch-resistant coating",
      "Open or closed-back configuration options",
      "Interlocking brackets included — no tools needed",
    ],
    description:
      "Why buy a fixed shelf when you can build your own? The SteelNest Storage Cube is a modular building block for your home — connect up to 6 cubes in any direction to create custom storage walls for your closet, pantry, or garage. Each cube is crafted from heavy-gauge cold-rolled steel plate with a scratch-resistant powder coat. Disassemble, fold flat, and move it anytime — or pass it down for decades. When its journey ends, the steel is 100% recyclable.",
    inStock: true,
    discount: "BEST SELLER",
  },
  {
    slug: "kitchen-counter-steel-spice-rack-organizer",
    name: "Kitchen Counter Steel Spice Rack Organizer",
    tagline:
      "Two-tier steel countertop organizer — keep spices, oils, and utensils tidy with lightweight eco-friendly metal.",
    price: 24.99,
    category: "desk",
    images: [
      "/products/spice-rack-01.svg",
      "/products/spice-rack-02.svg",
    ],
    specs: {
      material: "Cold-Rolled Steel",
      dimensions: "45 × 18 × 22 cm (17.7 × 7.1 × 8.7 inch)",
      weightCapacity: "10 kg (22 lbs) per tier",
      weight: "1.2 kg (2.6 lbs)",
    },
    colors: [
      { name: "Charcoal Black", hex: "#2D3436" },
      { name: "Copper Gold", hex: "#C9A96E" },
    ],
    features: [
      "One-second snap-lock assembly — no tools required",
      "Oil-resistant and rust-proof coating for kitchen use",
      "Two-tier stepped design for easy visibility and access",
      "100% recyclable steel — sustainable kitchen upgrade",
      "Compact footprint saves valuable counter space",
    ],
    description:
      "Your kitchen deserves better than flimsy plastic racks. The SteelNest Spice Rack brings industrial-grade cold-rolled steel to your countertop in a sleek two-tier stepped layout. The oil-resistant coating wipes clean in seconds, while the open-grid design means no more digging through cluttered cabinets to find the paprika. Lightweight yet sturdy, it\'s the sustainable upgrade your kitchen has been waiting for.",
    inStock: true,
  },
  {
    slug: "floor-multi-tier-steel-utility-storage-shelf",
    name: "Floor Multi-Tier Steel Utility Storage Shelf",
    tagline:
      "Freestanding DIY steel shelving unit — organize your living room, bedroom, or garage with recyclable metal furniture.",
    price: 89.99,
    category: "storage",
    images: [
      "/products/utility-shelf-01.svg",
      "/products/utility-shelf-02.svg",
    ],
    specs: {
      material: "Reinforced Cold-Rolled Steel Frame",
      dimensions: "80 × 40 × 120 cm (31.5 × 15.7 × 47.2 inch)",
      weightCapacity: "80 kg (176 lbs) total, 20 kg per shelf",
      weight: "8.5 kg (18.7 lbs)",
    },
    colors: [
      { name: "Charcoal Black", hex: "#2D3436" },
      { name: "Matte White", hex: "#F5F5F0" },
    ],
    features: [
      "Freely adjustable shelf heights — 1-inch increments",
      "Flat-pack shipping: all parts fit in one slim box",
      "Bolt-free snap assembly — no screwdriver needed",
      "100% recyclable steel — a furniture piece for life",
      "Anti-tip wall anchor included for safety",
    ],
    description:
      "The SteelNest Utility Shelf is the workhorse of our collection. Four tiers of reinforced cold-rolled steel, each adjustable in 1-inch increments, give you limitless configuration options — from living room display shelves to garage tool storage. The entire unit ships flat in one compact box and assembles without a single screw or bolt. Built to hold up to 80 kg and designed to be recycled at end of life, this is furniture that respects both your home and the planet.",
    inStock: true,
    isBestseller: true,
  },
];

// ===== 辅助查询函数（供页面调用）=====

/** 获取所有产品 */
export function getAllProducts(): Product[] {
  return products;
}

/** 根据 slug 获取单个产品 */
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

/** 按分类筛选产品 */
export function getProductsByCategory(
  category: "desk" | "storage" | "bathroom"
): Product[] {
  return products.filter((p) => p.category === category);
}

/** 获取推荐/精选产品 */
export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.isBestseller || p.isNew).slice(0, 4);
}
