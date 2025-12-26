import React from 'react';
import { 
  ClockIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  WrenchIcon,
  TruckIcon
} from '@heroicons/react/24/outline';
import { OrderRepairStatus } from '../../types/repair-order.types';

interface TimelineStep {
  status: OrderRepairStatus;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface StatusTimelineProps {
  currentStatus: OrderRepairStatus;
  className?: string;
}

const timelineSteps: TimelineStep[] = [
  {
    status: OrderRepairStatus.IN_REVIEW,
    label: 'En Revisión',
    icon: ClockIcon,
    color: 'text-blue-600',
  },
  {
    status: OrderRepairStatus.WAITING_APPROVAL,
    label: 'Esperando Aprobación',
    icon: ExclamationCircleIcon,
    color: 'text-yellow-600',
  },
  {
    status: OrderRepairStatus.IN_REPAIR,
    label: 'En Reparación',
    icon: WrenchIcon,
    color: 'text-blue-600',
  },
  {
    status: OrderRepairStatus.READY,
    label: 'Lista para Entrega',
    icon: CheckCircleIcon,
    color: 'text-green-600',
  },
  {
    status: OrderRepairStatus.DELIVERED,
    label: 'Entregada',
    icon: TruckIcon,
    color: 'text-green-700',
  },
];

export const StatusTimeline: React.FC<StatusTimelineProps> = ({ 
  currentStatus,
  className = '' 
}) => {
  const currentIndex = timelineSteps.findIndex(step => step.status === currentStatus);
  
  // Si está rechazada, mostrar solo ese estado
  if (currentStatus === OrderRepairStatus.REJECTED) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="flex items-center gap-2 text-red-600">
          <ExclamationCircleIcon className="w-6 h-6" />
          <span className="font-semibold">Orden Rechazada</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between">
        {timelineSteps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index <= currentIndex;
          const isCurrent = index === currentIndex;
          
          return (
            <React.Fragment key={step.status}>
              {/* Step */}
              <div className="flex flex-col items-center flex-1">
                <div 
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    transition-all duration-300
                    ${isActive 
                      ? `${step.color} bg-opacity-10 border-2` 
                      : 'bg-gray-100 border-2 border-gray-300 text-gray-400'
                    }
                    ${isCurrent ? 'ring-4 ring-opacity-30 ring-blue-300' : ''}
                  `}
                  style={isActive ? { borderColor: 'currentColor' } : {}}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span 
                  className={`
                    mt-2 text-xs font-medium text-center
                    ${isActive ? 'text-gray-900' : 'text-gray-400'}
                  `}
                >
                  {step.label}
                </span>
              </div>

              {/* Line between steps */}
              {index < timelineSteps.length - 1 && (
                <div 
                  className={`
                    h-0.5 flex-1 mx-2 transition-all duration-300
                    ${index < currentIndex ? 'bg-blue-600' : 'bg-gray-300'}
                  `}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
