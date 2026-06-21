"use client";

/**
 * 管理后台顶栏
 */

import { useRouter } from "next/navigation";

export default function AdminHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    // 清除 cookie 并刷新页面
    document.cookie =
      "admin_auth_token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/admin/login");
  };

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <div className="text-sm text-gray-500">
        SteelNest 跨境电商自动化管理系统
      </div>

      <div className="flex items-center gap-4">
        {/* 当前状态指示 */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
          系统运行中
        </div>

        <button
          onClick={handleLogout}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors"
        >
          退出登录
        </button>
      </div>
    </header>
  );
}
