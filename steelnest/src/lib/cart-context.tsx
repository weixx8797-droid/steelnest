"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { Product } from "@/data/products";

// ====== 类型定义 ======
export interface CartItem {
  product: Product;
  quantity: number;
  color: string; // 用户选择的颜色名
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  addToCart: (product: Product, quantity?: number, color?: string) => void;
  removeFromCart: (slug: string, color: string) => void;
  updateQuantity: (slug: string, color: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  totalItems: number;
  subtotal: number;
  shippingFee: number;
  freeShippingThreshold: number;
  freeShippingRemaining: number;
  isFreeShipping: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// ====== 常量 ======
const FREE_SHIPPING_THRESHOLD = 49; // $49 包邮
const FLAT_SHIPPING_FEE = 5.99; // 不满则 $5.99 运费
const STORAGE_KEY = "steelnest-cart";

// ====== 从 localStorage 读取购物车 ======
function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// ====== 保存购物车到 localStorage ======
function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // 隐私模式可能禁止 localStorage，忽略
  }
}

// ====== Provider 组件 ======
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // 首次加载：从 localStorage 恢复购物车
  useEffect(() => {
    setItems(loadCart());
    setIsLoaded(true);
  }, []);

  // 购物车变化时：保存到 localStorage
  useEffect(() => {
    if (isLoaded) {
      saveCart(items);
    }
  }, [items, isLoaded]);

  // ---- 加入购物车 ----
  const addToCart = useCallback(
    (product: Product, quantity = 1, color?: string) => {
      const selectedColor = color || product.colors[0].name;
      setItems((prev) => {
        const existing = prev.find(
          (item) =>
            item.product.slug === product.slug && item.color === selectedColor
        );
        if (existing) {
          return prev.map((item) =>
            item.product.slug === product.slug &&
            item.color === selectedColor
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prev, { product, quantity, color: selectedColor }];
      });
      setIsOpen(true); // 加入后自动打开购物车
    },
    []
  );

  // ---- 移除商品 ----
  const removeFromCart = useCallback(
    (slug: string, color: string) => {
      setItems((prev) =>
        prev.filter(
          (item) => !(item.product.slug === slug && item.color === color)
        )
      );
    },
    []
  );

  // ---- 修改数量 ----
  const updateQuantity = useCallback(
    (slug: string, color: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(slug, color);
        return;
      }
      setItems((prev) =>
        prev.map((item) =>
          item.product.slug === slug && item.color === color
            ? { ...item, quantity }
            : item
        )
      );
    },
    [removeFromCart]
  );

  // ---- 清空购物车 ----
  const clearCart = useCallback(() => setItems([]), []);

  // ---- 抽屉控制 ----
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((v) => !v), []);

  // ---- 计算 ----
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingFee = isFreeShipping ? 0 : FLAT_SHIPPING_FEE;
  const freeShippingRemaining = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - subtotal
  );

  const value: CartContextType = {
    items,
    isOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
    totalItems,
    subtotal,
    shippingFee,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    freeShippingRemaining,
    isFreeShipping,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// ====== Hook：组件中使用购物车 ======
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a <CartProvider>");
  }
  return ctx;
}
