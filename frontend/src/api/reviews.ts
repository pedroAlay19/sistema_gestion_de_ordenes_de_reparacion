import { http } from './http';
import type { Review, BestReview, CreateRepairOrderReviewDto, UpdateRepairOrderReviewDto } from '../types/review.types';

export const reviews = {
  create: (data: CreateRepairOrderReviewDto) =>
    http.post<Review>('/repair-order-reviews', data, true),
  
  getBest: () =>
    http.get<BestReview[]>('/repair-order-reviews/best-reviews'),

  findByRepairOrderId: (repairOrderId: string) =>
    http.get<Review[]>(`/repair-order-reviews/repair-order/${repairOrderId}`, true),

  findAll: () =>
    http.get<Review[]>('/repair-order-reviews', true),

  findOne: (id: string) =>
    http.get<Review>(`/repair-order-reviews/${id}`, true),

  update: (reviewId: string, data: UpdateRepairOrderReviewDto) =>
    http.patch<Review>(`/repair-order-reviews/${reviewId}`, data, true),

  delete: (reviewId: string) =>
    http.delete<void>(`/repair-order-reviews/${reviewId}`, true),
};
