import type { ReactNode } from 'react';

interface ActivityItemProps {
  icon: ReactNode;
  title: string;
  description: string;
  time: string;
  iconBgColor?: string;
}

export const ActivityItem = ({
  icon,
  title,
  description,
  time,
  iconBgColor = 'bg-blue-500/10',
}: ActivityItemProps) => {
  return (
    <div className="flex items-start gap-4 p-4 hover:bg-gray-800/50 rounded-lg transition-colors">
      <div className={`p-2 rounded-lg ${iconBgColor} shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white font-medium text-sm">{title}</p>
        <p className="text-gray-400 text-sm truncate">{description}</p>
      </div>
      <span className="text-gray-500 text-xs whitespace-nowrap">{time}</span>
    </div>
  );
};
