// export enum OrderRepairStatus {
//   IN_REVIEW = "IN_REVIEW",
//   WAITING_APPROVAL = "WAITING_APPROVAL",
//   REJECTED = "REJECTED",
//   IN_REPAIR = "IN_REPAIR",
//   WAITING_PARTS = "WAITING_PARTS",
//   READRY = "READY",
//   DELIVERED = "DELIVERED"
// }

export enum OrderRepairStatus { // PARA Q NO haya errores jsjs
    OPEN = "OPEN",
    IN_PROGRESS = "IN_PROGRESS",
    AWAITING_PARTS = "AWAITING_PARTS",
    READY_FOR_PICKUP = "READY_FOR_PICKUP",
    CLOSED = "CLOSED",
    RESOLVED = "RESOLVED",
}

export interface RepairOrder {
  id: string;
  equipment: {
    id: string;
    name: string;
    type: string;
    brand: string;
    model: string;
  };
  problemDescription: string;
  diagnosis?: string;
  estimatedCost: number;
  finalCost?: number;
  warrantyStartDate?: string;
  warrantyEndDate?: string;
  status: OrderRepairStatus;
  createdAt: string;
  updatedAt: string;
}
