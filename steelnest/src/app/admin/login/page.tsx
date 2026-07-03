"use client";

/**
 * 管理后台登录页
 * 输入密码 → 调 API → 成功后跳转到 /admin
 */

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

/** 登录表单组件（使用 useSearchParams，需要 Suspense） */
function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("请输入密码");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push(redirectTo);
        router.refresh();
      } else {
        setError("密码错误，请重试");
      }
    } catch {
      setError("网络错误，请检查连接");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-charcoal">
      <div className="w-full max-w-sm mx-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <Image
            src="/logo-icon.svg"
            alt="SteelNest"
            width={48}
            height={48}
            className="mx-auto mb-3"
          />
          <h1 className="text-xl font-bold text-white tracking-wide">
            SteelNest
          </h1>
          <p className="text-sm text-gray-400 mt-1">管理后台</p>
        </div>

        {/* 登录表单 */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow-lg space-y-4">
          <div>
            <label htmlFor="password" className="block text-xs font-medium text-gray-500 mb-1.5">
              管理员密码
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入管理密码"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-copper focus:border-transparent"
              autoFocus
              disabled={loading}
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-brand-charcoal text-white rounded-md text-sm font-medium hover:bg-brand-copper transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "验证中..." : "登录"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-4">
          默认密码：admin123（请在 .env.local 中修改 ADMIN_PASSWORD）
        </p>
      </div>
    </div>
  );
}

/** 用 Suspense 包裹登录表单（Next.js 静态构建要求） */
export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-brand-charcoal"><p className="text-white">Loading...</p></div>}>
      <LoginForm />
    </Suspense>
  );
}
