import type { RepairOrderDetail } from "./repair-order-detail.types";
import type { UserProfile } from "./user.types";

export interface Technician extends UserProfile {
  specialty?: string;
  isEvaluator: boolean;
  active: boolean;
  ticketServices?: RepairOrderDetail[];
}