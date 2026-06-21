/**
 * 仪表盘统计卡片组件
 */
interface DashboardStatsProps {
  stats: {
    totalOrders: number;
    totalProducts: number;
    activeInquiries: number;
    monthlyRevenue: number;
  };
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const cards = [
    {
      label: "总订单",
      value: stats.totalOrders,
      suffix: "笔",
      color: "blue" as const,
      trend: null,
    },
    {
      label: "在售产品",
      value: stats.totalProducts,
      suffix: "款",
      color: "green" as const,
      trend: null,
    },
    {
      label: "活跃询盘",
      value: stats.activeInquiries,
      suffix: "个",
      color: "copper" as const,
      trend: null,
    },
    {
      label: "本月收入",
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      suffix: "",
      color: "charcoal" as const,
      trend: null,
    },
  ];

  const colorMap = {
    blue: "border-l-blue-500 bg-blue-50/50",
    green: "border-l-green-500 bg-green-50/50",
    copper: "border-l-brand-copper bg-brand-copper/5",
    charcoal: "border-l-gray-700 bg-gray-50/50",
  };

  const valueColorMap = {
    blue: "text-blue-700",
    green: "text-green-700",
    copper: "text-brand-copper",
    charcoal: "text-gray-700",
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`bg-white rounded-lg border border-gray-200 border-l-4 ${colorMap[card.color]} p-4`}
        >
          <div className="text-xs text-gray-500 mb-1">{card.label}</div>
          <div className={`text-2xl font-bold ${valueColorMap[card.color]}`}>
            {card.value}
            <span className="text-sm font-normal text-gray-400 ml-0.5">
              {card.suffix}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
