export { auth, authHelpers } from './auth';
export { users } from './users';
export { equipments } from './equipments';
export { services } from './services';
export { spareParts } from './spare-parts';
export { repairOrders } from './repair-orders';
export { reviews } from './reviews';
export { uploadImage, supabase } from './supabase';
export * from './reports';

export type { 
  CreateRepairOrderDto,
  EvaluateRepairOrderDto,
  AssignRepairWorkDto,
  OrdersOverview,
  RevenueStats,
  OrdersByStatus,
  TopServices,
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
  UserProfile,
  UpdateProfileDto,
  UsersOverview,
} from '../types/user.types';

export type {
  Technician,
} from '../types/technician.types';

export type {
  AuthUser,
  LoginResponse,
  RegisterResponse,
  LoginDto,
  RegisterDto,
  RefreshTokenDto,
  RefreshTokenResponse,
  ValidateTokenResponse,
  ProfileResponse,
  LogoutResponse,
  JwtPayload
} from '../types/auth.types';

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
