import fs from "fs";
import path from "path";

interface Supplier {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  country: string;
  status: string;
}

function getSuppliers(): Supplier[] {
  const filePath = path.join(process.cwd(), "src/data/suppliers.json");
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export default async function AdminSuppliersPage() {
  const suppliers = getSuppliers();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">供应商管理</h1>
        <span className="text-sm text-gray-500">{suppliers.length} 家供应商</span>
      </div>

      {suppliers.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="text-4xl mb-3">🏭</div>
          <p className="text-gray-500 text-sm">暂无供应商</p>
          <p className="text-gray-400 text-xs mt-1">
            你可以手动添加供应商，或等 ACCIO 自动发现
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 uppercase tracking-wider bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3">公司名</th>
                <th className="px-4 py-3">联系人</th>
                <th className="px-4 py-3">邮箱</th>
                <th className="px-4 py-3">国家</th>
                <th className="px-4 py-3">状态</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((s) => (
                <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-700">{s.companyName}</td>
                  <td className="px-4 py-3 text-gray-600">{s.contactName}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{s.email}</td>
                  <td className="px-4 py-3 text-gray-500">{s.country}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      s.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {s.status === "active" ? "活跃" : s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
