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
export { spareParts } from './spare-parts';
export { technicians } from './technicians';
export { users } from './users';
export { admin } from './admin';
export { uploadImage, supabase } from './supabase';

// DTOs
export type { CreateEquipmentDto, UpdateEquipmentDto } from './equipments';
export type { 
  CreateRepairOrderDto, 
  UpdateRepairOrderDto, 
  UpdateRepairOrderDetailStatusDto,
  CreateRepairOrderDetailDto,
  UpdateRepairOrderDetailDto,
  CreateRepairOrderPartDto,
  UpdateRepairOrderPartDto
} from './repair-orders';
export type { CreateReviewDto } from './reviews';
export type { Technician } from './technicians';
export type { UpdateUserDto } from './users';

import { admin } from './api';
// Legacy exports for backward compatibility
import { auth } from './auth';
import { equipments } from './equipments';
import { repairOrders } from './repair-orders';
import { reviews } from './reviews';
import { services } from './services';
import { spareParts } from './spare-parts';

export const login = auth.login;
export const register = auth.register;
export const getProfile = auth.getProfile;

export const getEquipments = equipments.getAll;
export const getEquipment = equipments.getById;
export const createEquipment = equipments.create;
export const updateEquipment = equipments.update;
export const deleteEquipment = equipments.delete;

export const getRepairOrders = repairOrders.getAll;
export const getRepairOrdersByEvaluator = repairOrders.getByEvaluator;
export const getRepairOrder = repairOrders.getById;
export const createRepairOrder = repairOrders.create;
export const updateRepairOrder = repairOrders.update;
export const deleteRepairOrder = repairOrders.delete;

export const createReview = reviews.create;
export const getBestsReviews = reviews.getBest;
export const getReviewByRepairOrderId = reviews.findByRepairOrderId;
export const getReviewsByRole = reviews.findByRole;
export const updateReview = reviews.update;

export const getServices = services.getAll;
export const getSpareParts = spareParts.getAll;

// Admin exports
export const getAllClients = admin.getAllClients;
export const deleteClient = admin.deleteClient;

export const createTechnician = admin.createTechnician;
export const getAllTechnicians = admin.getAllTechnicians;
export const updateTechnician = admin.updateTechnician;
export const deleteTechnician = admin.deleteTechnician;

export const getAllReviews = admin.getAllReviews;
export const getAllSpareParts = admin.getAllSpareParts;
export * from './dashboard-granular';
