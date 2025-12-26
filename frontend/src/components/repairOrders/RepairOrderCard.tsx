import {
  CalendarIcon,
  ClockIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { StatusTimeline } from "../ui";
import {
  getOrderStatusText,
  formatDate,
  formatCurrency,
} from "../../utils";
import type { RepairOrder } from "../../types/repair-order.types";
import { getBadgeClasses } from "../ui/Badge";

interface RepairOrderCardProps {
  order: RepairOrder;
}

export function RepairOrderCard({ order }: RepairOrderCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
      <div className="p-6">
        {/* Header de la orden */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-gray-900">
                Orden #{order.id.substring(0, 8).toUpperCase()}
              </h3>
              <span className={getBadgeClasses(order.status)}>
                {getOrderStatusText(order.status)}
              </span>
            </div>
            <p className="text-gray-900 font-medium mb-1">
              {order.equipment.name}
            </p>
            <p className="text-sm text-gray-600">
              {order.equipment.brand} - {order.equipment.model}
            </p>
          </div>

          {/* Costo estimado */}
          {order.estimatedCost && (
            <div className="text-right">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <CurrencyDollarIcon className="w-4 h-4" />
                <span>Costo Estimado</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(order.estimatedCost)}
              </p>
            </div>
          )}
        </div>

        {/* Timeline del estado */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <StatusTimeline currentStatus={order.status} />
        </div>

        {/* Información adicional */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              <span>Creada: {formatDate(order.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="w-4 h-4" />
              <span>Actualizada: {formatDate(order.updatedAt)}</span>
            </div>
          </div>

          <span className="text-sm font-medium text-blue-600">
            Ver detalles →
          </span>
        </div>
      </div>
    </div>
  );
}
