export interface CreateRepairOrderReviewDto {
  repairOrderId: string;
  rating: number;
  comment: string;
}

export interface UpdateRepairOrderReviewDto {
  rating?: number;
  comment?: string;
  visible?: boolean;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BestReview {
  rating: number;
  comment: string;
  equipmentName: string;
  userName: string;
  userLastName: string;
}
