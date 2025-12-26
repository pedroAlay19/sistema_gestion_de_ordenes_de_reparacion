import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import type { ReactNode } from 'react';

interface AlertCardProps {
  title: string;
  message: string;
  type?: 'warning' | 'error' | 'info';
  icon?: ReactNode;
  action?: ReactNode;
}

export const AlertCard = ({ title, message, type = 'warning', icon, action }: AlertCardProps) => {
  const colors = {
    warning: {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      text: 'text-yellow-400',
      icon: 'text-yellow-500',
    },
    error: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      text: 'text-red-400',
      icon: 'text-red-500',
    },
    info: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
      icon: 'text-blue-500',
    },
  };

  const colorClass = colors[type];

  return (
    <div
      className={`${colorClass.bg} border ${colorClass.border} rounded-lg p-4`}
    >
      <div className="flex items-start gap-3">
        <div className={colorClass.icon}>
          {icon || <ExclamationTriangleIcon className="w-5 h-5" />}
        </div>
        <div className="flex-1">
          <h4 className={`font-semibold text-sm ${colorClass.text}`}>
            {title}
          </h4>
          <p className="text-gray-400 text-sm mt-1">{message}</p>
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
};
