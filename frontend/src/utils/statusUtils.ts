import { TicketServiceStatus } from '../types/repair-order-detail.types';
import type { BadgeVariant } from '../components/ui/Badge';
import { OrderRepairStatus } from '../types/repair-order.types';

/**
 * Obtiene el color del badge según el estado de la orden
 */
export const getOrderStatusBadge = (status: OrderRepairStatus): BadgeVariant => {
  const statusMap: Record<OrderRepairStatus, BadgeVariant> = {
    [OrderRepairStatus.IN_REVIEW]: 'info',
    [OrderRepairStatus.WAITING_APPROVAL]: 'warning',
    [OrderRepairStatus.REJECTED]: 'danger',
    [OrderRepairStatus.IN_REPAIR]: 'info',
    [OrderRepairStatus.READY]: 'success',
    [OrderRepairStatus.DELIVERED]: 'success',
  };
  
  return statusMap[status] || 'default';
};

/**
 * Obtiene el texto legible del estado de la orden
 */
export const getOrderStatusText = (status: OrderRepairStatus): string => {
  const statusMap: Record<OrderRepairStatus, string> = {
    [OrderRepairStatus.IN_REVIEW]: 'En Revisión',
    [OrderRepairStatus.WAITING_APPROVAL]: 'Esperando Aprobación',
    [OrderRepairStatus.REJECTED]: 'Rechazada',
    [OrderRepairStatus.IN_REPAIR]: 'En Reparación',
    [OrderRepairStatus.READY]: 'Lista para Entrega',
    [OrderRepairStatus.DELIVERED]: 'Entregada',
  };
  
  return statusMap[status] || status;
};

/**
 * Obtiene el color del badge según el estado del servicio
 */
export const getServiceStatusBadge = (status: TicketServiceStatus): BadgeVariant => {
  const statusMap: Record<TicketServiceStatus, BadgeVariant> = {
    [TicketServiceStatus.PENDING]: 'secondary',
    [TicketServiceStatus.IN_PROGRESS]: 'info',
    [TicketServiceStatus.COMPLETED]: 'success',
  };
  
  return statusMap[status] || 'default';
};

/**
 * Obtiene el texto legible del estado del servicio
 */
export const getServiceStatusText = (status: TicketServiceStatus): string => {
  const statusMap: Record<TicketServiceStatus, string> = {
    [TicketServiceStatus.PENDING]: 'Pendiente',
    [TicketServiceStatus.IN_PROGRESS]: 'En Progreso',
    [TicketServiceStatus.COMPLETED]: 'Completado',
  };
  
  return statusMap[status] || status;
};

/**
 * Calcula el progreso de una orden basado en sus detalles
 */
export const calculateOrderProgress = (
  details?: Array<{ status: TicketServiceStatus }>
): number => {
  if (!details || details.length === 0) return 0;
  
  const completed = details.filter(d => d.status === TicketServiceStatus.COMPLETED).length;
  return Math.round((completed / details.length) * 100);
};
