import { readInquiries } from "@/lib/inquiries";
import { requireAdmin } from "@/lib/admin-auth";

// 每次请求都读取最新询盘，保证后台实时刷新
export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage() {
  await requireAdmin();
  const inquiries = await readInquiries();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">询盘管理</h1>
        <span className="text-sm text-gray-500">{inquiries.length} 条询盘</span>
      </div>

      {inquiries.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="text-4xl mb-3">✉️</div>
          <p className="text-gray-500 text-sm">还没有收到询盘</p>
          <p className="text-gray-400 text-xs mt-1">
            客户在前台「Request a Quote」提交后，会显示在这里
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 uppercase tracking-wider bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3">姓名 / 公司</th>
                  <th className="px-4 py-3">联系方式</th>
                  <th className="px-4 py-3">意向</th>
                  <th className="px-4 py-3">数量</th>
                  <th className="px-4 py-3">需求</th>
                  <th className="px-4 py-3">时间</th>
                </tr>
              </thead>
              <tbody>
                {[...inquiries]
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  )
                  .map((inq) => (
                    <tr
                      key={inq.id}
                      className="border-b border-gray-100 hover:bg-gray-50 align-top"
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-700">
                          {inq.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          {inq.company || "—"}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-gray-700">{inq.email}</div>
                        {inq.whatsapp && (
                          <div className="text-xs text-gray-400">
                            WA: {inq.whatsapp}
                          </div>
                        )}
                        <div className="text-xs text-gray-400">{inq.market}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{inq.interest}</td>
                      <td className="px-4 py-3 text-gray-700">
                        {inq.quantity || "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-600 max-w-xs whitespace-pre-wrap">
                        {inq.message}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                        {new Date(inq.createdAt).toLocaleString("zh-CN")}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
