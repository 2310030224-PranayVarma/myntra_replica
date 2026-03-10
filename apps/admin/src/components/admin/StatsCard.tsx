import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  color?: "green" | "blue" | "purple" | "orange" | "red" | "slate";
}

const COLOR_MAP = {
  green: {
    bg: "bg-green-50",
    icon: "bg-green-100 text-green-600",
    trend: "text-green-600",
  },
  blue: {
    bg: "bg-blue-50",
    icon: "bg-blue-100 text-blue-600",
    trend: "text-blue-600",
  },
  purple: {
    bg: "bg-purple-50",
    icon: "bg-purple-100 text-purple-600",
    trend: "text-purple-600",
  },
  orange: {
    bg: "bg-orange-50",
    icon: "bg-orange-100 text-orange-600",
    trend: "text-orange-600",
  },
  red: {
    bg: "bg-red-50",
    icon: "bg-red-100 text-red-600",
    trend: "text-red-600",
  },
  slate: {
    bg: "bg-slate-50",
    icon: "bg-slate-100 text-slate-600",
    trend: "text-slate-500",
  },
};

export default function StatsCard({
  label,
  value,
  icon: Icon,
  trend,
  color = "slate",
}: StatsCardProps) {
  const colors = COLOR_MAP[color];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-slate-800">{value}</p>
          {trend && (
            <p className={`text-xs mt-1 ${colors.trend}`}>{trend}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colors.icon}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
