import type { 
  User, 
  CreateUserDto,
  TechnicianUser,
  CreateTechnicianDto,
  UpdateTechnicianDto,
  Equipment,
  Service,
  CreateMaintenanceServiceDto,
  UpdateMaintenanceServiceDto,
  SparePartType,
  CreateSparePartDto,
  UpdateSparePartDto,
  RepairOrder,
  RepairOrderReview
} from "../types";
import { http } from "./http";

export const admin = {
  // Clients Management
  getAllClients: async (): Promise<User[]> => {
    return http.get("/users", true);
  },

  getClientById: async (id: string) => {
    return http.get(`/users/${id}`, true);
  },

  createClient: async (data: CreateUserDto): Promise<User> => {
    return http.post("/users", data, true);
  },

  deleteClient: async (id: string) => {
    return http.delete(`/users/${id}`, true);
  },

  // Technicians Management
  getAllTechnicians: async (): Promise<TechnicianUser[]> => {
    return http.get("/users/technician", true);
  },

  getTechnicianById: async (id: string) => {
    return http.get(`/users/${id}`, true);
  },

  createTechnician: async (data: CreateTechnicianDto): Promise<TechnicianUser> => {
    return http.post("/users/technician", data, true);
  },

  updateTechnician: async (id: string, data: UpdateTechnicianDto): Promise<TechnicianUser> => {
    return http.patch(`/users/technician/${id}`, data, true);
  },

  deleteTechnician: async (id: string) => {
    return http.delete(`/users/${id}`, true);
  },

  // Equipment Management
  getAllEquipments: async (): Promise<Equipment[]> => {
    return http.get("/equipments", true);
  },

  getEquipmentById: async (id: string) => {
    return http.get(`/equipments/${id}`, true);
  },

  updateEquipment: async (id: string, data: Partial<Equipment>): Promise<Equipment> => {
    return http.patch(`/equipments/${id}`, data, true);
  },

  deleteEquipment: async (id: string) => {
    return http.delete(`/equipments/${id}`, true);
  },

  // Services Management
  getAllServices: async () => {
    return http.get("/services", true);
  },

  getServiceById: async (id: string) => {
    return http.get(`/services/${id}`, true);
  },

  createService: async (data: CreateMaintenanceServiceDto): Promise<Service> => {
    return http.post("/services", data, true);
  },

  updateService: async (id: string, data: UpdateMaintenanceServiceDto): Promise<Service> => {
    return http.patch(`/services/${id}`, data, true);
  },

  deleteService: async (id: string) => {
    return http.delete(`/services/${id}`, true);
  },

  // Spare Parts Management
  getAllSpareParts: async (): Promise<SparePartType[]> => {
    return http.get("/spare-parts", true);
  },

  getSparePartById: async (id: string) => {
    return http.get(`/spare-parts/${id}`, true);
  },

  createSparePart: async (data: CreateSparePartDto): Promise<SparePartType> => {
    return http.post("/spare-parts", data, true);
  },

  updateSparePart: async (id: string, data: UpdateSparePartDto): Promise<SparePartType> => {
    return http.patch(`/spare-parts/${id}`, data, true);
  },

  deleteSparePart: async (id: string) => {
    return http.delete(`/spare-parts/${id}`, true);
  },

  // Reviews Management
  getAllReviews: async (): Promise<RepairOrderReview[]> => {
    return http.get("/repair-order-reviews", true);
  },

  getReviewById: async (id: string) => {
    return http.get(`/repair-order-reviews/${id}`, true);
  },

  updateReview: async (id: string, data: Partial<RepairOrderReview>): Promise<RepairOrderReview> => {
    return http.patch(`/repair-order-reviews/${id}`, data, true);
  },

  deleteReview: async (id: string) => {
    return http.delete(`/repair-order-reviews/${id}`, true);
  },

  // Repair Orders Management (Admin view - all orders)
  getAllRepairOrders: async () => {
    return http.get("/repair-orders", true);
  },

  getRepairOrderById: async (id: string) => {
    return http.get(`/repair-orders/${id}`, true);
  },

  updateRepairOrder: async (id: string, data: Partial<RepairOrder>): Promise<RepairOrder> => {
    return http.patch(`/repair-orders/${id}`, data, true);
  },

  deleteRepairOrder: async (id: string) => {
    return http.delete(`/repair-orders/${id}`, true);
  },
};
