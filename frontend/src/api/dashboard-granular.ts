import { http } from "./http";

// Repair Orders Types
export interface OrdersOverview {
  totalOrders: number;
  activeOrders: number;
  rejectedOrders: number;
  completedOrders: number;
}

export interface RevenueStats {
  totalRevenue: number;
  averageCost: number;
  completedOrdersCount: number;
}

export interface OrdersByStatus {
  ordersByStatus: Array<{
    status: string;
    count: number;
  }>;
}

export interface RecentOrders {
  recentOrders: Array<{
    id: string;
    problemDescription: string;
    status: string;
    clientName: string;
    equipmentName: string;
    createdAt: string;
    finalCost: number;
  }>;
}

export interface TopServices {
  topServices: Array<{
    serviceName: string;
    count: number;
    revenue: number;
  }>;
}

export interface CountMetric {
  count: number;
}

export interface RevenueMetric {
  revenue: number;
}

// Users Types
export interface UsersOverview {
  totalClients: number;
  totalTechnicians: number;
  activeTechnicians: number;
}

export interface TopClients {
  topClients: Array<{
    id: string;
    name: string;
    email: string;
    totalOrders: number;
    totalSpent: number;
  }>;
}

export interface TopTechnicians {
  topTechnicians: Array<{
    id: string;
    name: string;
    specialty: string;
    completedOrders: number;
    revenue: number;
    active: boolean;
  }>;
}

// ==================== GRANULAR API CALLS ====================

// --- REPAIR ORDERS STATS ---
export const getOrdersOverview = async (): Promise<OrdersOverview> => {
  return http.get<OrdersOverview>("/repair-orders/stats/overview", true);
};

export const getRevenueStats = async (): Promise<RevenueStats> => {
  return http.get<RevenueStats>("/repair-orders/stats/revenue", true);
};

export const getOrdersByStatus = async (): Promise<OrdersByStatus> => {
  return http.get<OrdersByStatus>("/repair-orders/stats/by-status", true);
};

export const getRecentOrders = async (
  limit: number = 10
): Promise<RecentOrders> => {
  return http.get<RecentOrders>(
    `/repair-orders/stats/recent?limit=${limit}`,
    true
  );
};

export const getTopServices = async (
  limit: number = 5
): Promise<TopServices> => {
  return http.get<TopServices>(
    `/repair-orders/stats/top-services?limit=${limit}`,
    true
  );
};

export const getTotalOrdersCount = async (): Promise<CountMetric> => {
  return http.get<CountMetric>("/repair-orders/stats/count/total", true);
};

export const getActiveOrdersCount = async (): Promise<CountMetric> => {
  return http.get<CountMetric>("/repair-orders/stats/count/active", true);
};

export const getTotalRevenue = async (): Promise<RevenueMetric> => {
  return http.get<RevenueMetric>("/repair-orders/stats/revenue/total", true);
};

// --- USERS STATS ---
export const getUsersOverview = async (): Promise<UsersOverview> => {
  return http.get<UsersOverview>("/users/stats/overview", true);
};

export const getTopClients = async (limit: number = 5): Promise<TopClients> => {
  return http.get<TopClients>(`/users/stats/top-clients?limit=${limit}`, true);
};

export const getTopTechnicians = async (
  limit: number = 5
): Promise<TopTechnicians> => {
  return http.get<TopTechnicians>(
    `/users/stats/top-technicians?limit=${limit}`,
    true
  );
};

export const getTotalClientsCount = async (): Promise<CountMetric> => {
  return http.get<CountMetric>("/users/stats/count/clients", true);
};

export const getTotalTechniciansCount = async (): Promise<CountMetric> => {
  return http.get<CountMetric>("/users/stats/count/technicians", true);
};

export const getActiveTechniciansCount = async (): Promise<CountMetric> => {
  return http.get<CountMetric>("/users/stats/count/active-technicians", true);
};

// ==================== HELPER: FETCH ALL DASHBOARD DATA ====================
export interface FullDashboardData {
  orders_overview: OrdersOverview;
  orders_revenue: RevenueStats;
  orders_by_status: OrdersByStatus;
  orders_recent: RecentOrders;
  orders_top_services: TopServices;
  users_overview: UsersOverview;
  users_top_clients: TopClients;
  users_top_technicians: TopTechnicians;
}

export const fetchFullDashboard = async (): Promise<FullDashboardData> => {
  const [
    orders_overview,
    orders_revenue,
    orders_by_status,
    orders_recent,
    orders_top_services,
    users_overview,
    users_top_clients,
    users_top_technicians,
  ] = await Promise.all([
    getOrdersOverview(),
    getRevenueStats(),
    getOrdersByStatus(),
    getRecentOrders(),
    getTopServices(),
    getUsersOverview(),
    getTopClients(),
    getTopTechnicians(),
  ]);

  return {
    orders_overview,
    orders_revenue,
    orders_by_status,
    orders_recent,
    orders_top_services,
    users_overview,
    users_top_clients,
    users_top_technicians,
  };
};
