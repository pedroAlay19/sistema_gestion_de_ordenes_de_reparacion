/**
 * API Entry Point
 * Punto de entrada único para todas las APIs
 */

// Services
export { auth } from './auth';
export { equipments } from './equipments';
export { repairOrders } from './repair-orders';
export { reviews } from './reviews';
export { services } from './services';

// DTOs
export type { CreateEquipmentDto, UpdateEquipmentDto } from './equipments';
export type { CreateRepairOrderDto } from './repair-orders';
export type { CreateReviewDto } from './reviews';

// Legacy exports for backward compatibility
import { auth } from './auth';
import { equipments } from './equipments';
import { repairOrders } from './repair-orders';
import { reviews } from './reviews';
import { services } from './services';

export const login = auth.login;
export const register = auth.register;
export const getProfile = auth.getProfile;

export const getEquipments = equipments.getAll;
export const createEquipment = equipments.create;
export const updateEquipment = equipments.update;
export const deleteEquipment = equipments.delete;

export const getRepairOrders = repairOrders.getAll;
export const getRepairOrder = repairOrders.getById;
export const createRepairOrder = repairOrders.create;

export const createReview = reviews.create;
export const getBestsReviews = reviews.getBest;

export const getServices = services.getAll;
