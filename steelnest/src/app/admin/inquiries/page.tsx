export default function AdminInquiriesPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">询盘管理</h1>
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <div className="text-4xl mb-3">✉️</div>
        <p className="text-gray-500 text-sm">询盘邮件自动化模块尚未启用</p>
        <p className="text-gray-400 text-xs mt-1">
          此功能将在第二阶段开放：自动发送询盘邮件 + AI 解析供应商回复
        </p>
      </div>
    </div>
  );
}
