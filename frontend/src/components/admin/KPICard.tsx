import type{ ReactNode } from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  iconBgColor?: string;
}

export const KPICard = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  iconBgColor = 'bg-blue-500/10',
}: KPICardProps) => {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-400 text-sm font-medium mb-2">{title}</p>
          <p className="text-white text-3xl font-bold mb-1">{value}</p>
          {subtitle && (
            <p className="text-gray-500 text-sm">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              <span
                className={`text-sm font-medium ${
                  trend.isPositive ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-gray-500 text-sm ml-2">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${iconBgColor}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};
