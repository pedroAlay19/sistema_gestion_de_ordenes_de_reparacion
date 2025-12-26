import type { ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
}

export const ChartCard = ({ title, subtitle, children, action }: ChartCardProps) => {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-white text-lg font-semibold">{title}</h3>
          {subtitle && (
            <p className="text-gray-400 text-sm mt-1">{subtitle}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
};
