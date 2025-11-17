// Auth Types
export { UserRole } from './auth.types';
export type { 
  User, 
  AuthContextType, 
  Technician as TechnicianUser,
  CreateUserDto,
  UpdateUserDto,
  CreateTechnicianDto,
  UpdateTechnicianDto
} from './auth.types';

// Equipment Types
export { EquipmentType, EquipmentStatus } from './equipment.types';
export type { Equipment, EquipmentFormData } from './equipment.types';

// Repair Order Types
export { 
  OrderRepairStatus, 
  TicketServiceStatus, 
  NotificationStatus 
} from './repair-order.types';
export type { 
  RepairOrder,
  RepairOrderDetail,
  RepairOrderPart,
  RepairOrderReview,
  Technician,
  MaintenanceService,
  SparePart
} from './repair-order.types';

// Notification Types
export type { Notification } from './notification.types';

// Review Types
export type { Review, BestReview } from './review.types';

// Service Types
export { ServiceType } from './service.types';
export type { 
  Service,
  CreateMaintenanceServiceDto,
  UpdateMaintenanceServiceDto
} from './service.types';

// Spare Part Types
export type {
  SparePart as SparePartType,
  CreateSparePartDto,
  UpdateSparePartDto
} from './spare-part.types';
