/**
 * Review Types
 * Tipos relacionados con reseñas y valoraciones
 */

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface BestReview {
  rating: number;
  comment: string;
  equipmentName: string;
  userName: string;
  userLastName: string;
}
