export { auth } from './auth';
export { users } from './users';
export { equipments } from './equipments';
export { services } from './services';
export { spareParts } from './spare-parts';
export { repairOrders } from './repair-orders';
export { reviews } from './reviews';
export { uploadImage, supabase } from './supabase';
export * from './reports';

// Re-export types desde types/
export type { 
  CreateRepairOrderDto,
  EvaluateRepairOrderDto,
  AssignRepairWorkDto,
  OrdersOverview,
  RevenueStats,
  OrdersByStatus,
  TopServices,
  RecentOrders,
  RepairOrder,
  OrderRepairStatus
} from '../types/repair-order.types';

export type {
  CreateRepairOrderDetailDto,
  UpdateDetailStatusDto,
  RepairOrderDetail,
  TicketServiceStatus
} from '../types/repair-order-detail.types';

export type {
  CreateRepairOrderPartDto,
  RepairOrderPart
} from '../types/repair-order-part.types';

export type {
  User,
  CreateUserDto,
  UpdateUserDto,
  UserRole,
  UsersOverview,
  TopClients,
  TopTechnicians
} from '../types/user.types';

export type {
  Technician,
  CreateTechnicianDto,
  UpdateTechnicianDto
} from '../types/technician.types';

export type {
  Equipment,
  CreateEquipmentDto,
  UpdateEquipmentDto,
  EquipmentType,
  EquipmentStatus
} from '../types/equipment.types';

export type {
  Service,
  CreateMaintenanceServiceDto,
  UpdateMaintenanceServiceDto
} from '../types/service.types';

export type {
  SparePart,
  CreateSparePartDto,
  UpdateSparePartDto
} from '../types/spare-part.types';

export type {
  Review,
  BestReview,
  CreateRepairOrderReviewDto,
  UpdateRepairOrderReviewDto
} from '../types/review.types';
