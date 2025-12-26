import { useEffect, useState, type JSX } from "react";
import {
  CurrencyDollarIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  WrenchScrewdriverIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { repairOrders } from "../../api/repair-orders";
import { users } from "../../api/users";
import type { OrdersOverview, RevenueStats, OrdersByStatus, TopServices } from "../../types/repair-order.types";
import type { UsersOverview } from "../../types/user.types";

// Type para los datos completos del dashboard
export interface FullDashboardData {
  orders_overview: OrdersOverview;
  orders_revenue: RevenueStats;
  orders_by_status: OrdersByStatus;
  orders_top_services: TopServices;
  users_overview: UsersOverview;
}

// Helper para cargar todos los datos del dashboard
const fetchFullDashboard = async (): Promise<FullDashboardData> => {
  const [
    orders_overview,
    orders_revenue,
    orders_by_status,
    orders_top_services,
    users_overview,
  ] = await Promise.all([
    repairOrders.getOrdersOverview(),
    repairOrders.getRevenueStats(),
    repairOrders.getOrdersByStatus(),
    repairOrders.getTopServices(10),
    users.getUsersOverview(),
  ]);

  return {
    orders_overview,
    orders_revenue,
    orders_by_status,
    orders_top_services,
    users_overview,
  };
};

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<FullDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch inicial de todos los datos
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const data = await fetchFullDashboard();
        setDashboardData(data);
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { label: string; color: string; icon: JSX.Element }> = {
      IN_REVIEW: { 
        label: "En Revisión", 
        color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        icon: <ClockIcon className="w-5 h-5" />
      },
      WAITING_APPROVAL: { 
        label: "Esperando Aprobación", 
        color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
        icon: <ClockIcon className="w-5 h-5" />
      },
      REJECTED: { 
        label: "Rechazado", 
        color: "bg-red-500/10 text-red-400 border-red-500/20",
        icon: <XCircleIcon className="w-5 h-5" />
      },
      IN_REPAIR: { 
        label: "En Reparación", 
        color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        icon: <WrenchScrewdriverIcon className="w-5 h-5" />
      },
      READY: { 
        label: "Listo", 
        color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        icon: <CheckCircleIcon className="w-5 h-5" />
      },
      DELIVERED: { 
        label: "Entregado", 
        color: "bg-green-500/10 text-green-400 border-green-500/20",
        icon: <CheckCircleIcon className="w-5 h-5" />
      },
    };
    return statusMap[status] || { 
      label: status, 
      color: "bg-gray-500/10 text-gray-400 border-gray-500/20",
      icon: <ClockIcon className="w-5 h-5" />
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950">
        <div className="text-center">
          <p className="text-white text-xl mb-2">No hay datos disponibles</p>
          <p className="text-gray-400">Intenta recargar la página</p>
        </div>
      </div>
    );
  }

  const totalOrdersCount = dashboardData.orders_overview.totalOrders || 1;

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-400">
              Vista general de las operaciones del taller
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-emerald-400 font-medium">Sistema Activo</span>
          </div>
        </div>

        {/* KPIs principales - Estilo Supabase */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Orders */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center">
                <ClipboardDocumentListIcon className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-xs text-gray-500 font-medium">TOTAL</span>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-white">
                {dashboardData.orders_overview.totalOrders}
              </p>
              <p className="text-sm text-gray-400">Órdenes registradas</p>
            </div>
          </div>

          {/* Active Orders */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-purple-500/10 border border-purple-500/20 rounded-lg flex items-center justify-center">
                <WrenchScrewdriverIcon className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-xs text-gray-500 font-medium">ACTIVAS</span>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-white">
                {dashboardData.orders_overview.activeOrders}
              </p>
              <p className="text-sm text-gray-400">En proceso</p>
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center">
                <CurrencyDollarIcon className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-xs text-gray-500 font-medium">INGRESOS</span>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-white">
                ${Number(dashboardData.orders_revenue.totalRevenue).toFixed(0)}
              </p>
              <p className="text-sm text-gray-400">Facturación total</p>
            </div>
          </div>

          {/* Users */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/20 rounded-lg flex items-center justify-center">
                <UsersIcon className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="text-xs text-gray-500 font-medium">CLIENTES</span>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-white">
                {dashboardData.users_overview.totalClients}
              </p>
              <p className="text-sm text-gray-400">Registrados</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Orders Overview */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center">
                <ChartBarIcon className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Resumen de Órdenes</h3>
                <p className="text-xs text-gray-500">Estadísticas generales</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <span className="text-sm text-gray-400">Completadas</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-emerald-400">
                    {dashboardData.orders_overview.completedOrders}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({((dashboardData.orders_overview.completedOrders / totalOrdersCount) * 100).toFixed(0)}%)
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <span className="text-sm text-gray-400">En Proceso</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-purple-400">
                    {dashboardData.orders_overview.activeOrders}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({((dashboardData.orders_overview.activeOrders / totalOrdersCount) * 100).toFixed(0)}%)
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <span className="text-sm text-gray-400">Rechazadas</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-red-400">
                    {dashboardData.orders_overview.rejectedOrders}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({((dashboardData.orders_overview.rejectedOrders / totalOrdersCount) * 100).toFixed(0)}%)
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <span className="text-sm text-emerald-400 font-medium">Costo Promedio</span>
                <span className="text-lg font-bold text-emerald-400">
                  ${Number(dashboardData.orders_revenue.averageCost).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Technicians */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/20 rounded-lg flex items-center justify-center">
                <UsersIcon className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Personal</h3>
                <p className="text-xs text-gray-500">Técnicos disponibles</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-linear-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Total Técnicos</span>
                  <span className="text-2xl font-bold text-cyan-400">
                    {dashboardData.users_overview.totalTechnicians}
                  </span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-linear-to-r from-cyan-500 to-blue-500 rounded-full transition-all"
                    style={{ width: '100%' }}
                  ></div>
                </div>
              </div>
              <div className="p-4 bg-linear-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Activos</span>
                  <span className="text-2xl font-bold text-emerald-400">
                    {dashboardData.users_overview.totalActiveTechnicians}
                  </span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-linear-to-r from-emerald-500 to-cyan-500 rounded-full transition-all"
                    style={{ 
                      width: `${(dashboardData.users_overview.totalActiveTechnicians / (dashboardData.users_overview.totalTechnicians || 1)) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Tasa de Actividad</span>
                  <span className="text-sm font-semibold text-white">
                    {((dashboardData.users_overview.totalActiveTechnicians / (dashboardData.users_overview.totalTechnicians || 1)) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Stats */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center">
                <CurrencyDollarIcon className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Ingresos</h3>
                <p className="text-xs text-gray-500">Análisis financiero</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-linear-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-lg">
                <p className="text-xs text-emerald-400 mb-2 font-medium">FACTURACIÓN TOTAL</p>
                <p className="text-3xl font-bold text-white mb-1">
                  ${Number(dashboardData.orders_revenue.totalRevenue).toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">
                  De {dashboardData.orders_revenue.completedOrdersCount} órdenes completadas
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Promedio</p>
                  <p className="text-lg font-bold text-white">
                    ${Number(dashboardData.orders_revenue.averageCost).toFixed(0)}
                  </p>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Completadas</p>
                  <p className="text-lg font-bold text-white">
                    {dashboardData.orders_revenue.completedOrdersCount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Orders by Status - Gráfico de barras horizontal */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="mb-6">
              <h3 className="text-base font-semibold text-white mb-1">Órdenes por Estado</h3>
              <p className="text-xs text-gray-500">Distribución actual del sistema</p>
            </div>
            <div className="space-y-4">
              {dashboardData.orders_by_status.ordersByStatus
                .filter((item) => item.count > 0)
                .sort((a, b) => b.count - a.count)
                .map((item, index) => {
                  const percentage = ((item.count / totalOrdersCount) * 100).toFixed(1);
                  const statusInfo = getStatusInfo(item.status);
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg border ${statusInfo.color}`}>
                            {statusInfo.icon}
                          </div>
                          <span className="text-sm text-gray-300 font-medium">
                            {statusInfo.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-500">{percentage}%</span>
                          <span className="text-sm font-bold text-white min-w-8 text-right">
                            {item.count}
                          </span>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${statusInfo.color.includes('blue') ? 'bg-blue-500' : 
                            statusInfo.color.includes('yellow') ? 'bg-yellow-500' :
                            statusInfo.color.includes('red') ? 'bg-red-500' :
                            statusInfo.color.includes('purple') ? 'bg-purple-500' :
                            statusInfo.color.includes('emerald') ? 'bg-emerald-500' :
                            'bg-green-500'} rounded-full transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Top Services */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="mb-6">
              <h3 className="text-base font-semibold text-white mb-1">Servicios Principales</h3>
              <p className="text-xs text-gray-500">Top 5 servicios más solicitados</p>
            </div>
            <div className="space-y-3">
              {dashboardData.orders_top_services.topServices.slice(0, 5).map((service, index) => {
                const maxRevenue = Math.max(...dashboardData.orders_top_services.topServices.map(s => Number(s.revenue)));
                const percentage = ((Number(service.revenue) / maxRevenue) * 100).toFixed(0);
                return (
                  <div key={index} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 font-bold text-sm shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white font-medium truncate group-hover:text-blue-400 transition-colors">
                            {service.serviceName}
                          </p>
                          <p className="text-xs text-gray-500">{service.count} servicios</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-emerald-400 ml-3">
                        ${Number(service.revenue).toFixed(0)}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-between p-4 bg-gray-900/50 border border-gray-800 rounded-xl">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span>Última actualización: {new Date().toLocaleString('es-ES')}</span>
          </div>
          <span className="text-xs text-gray-600 font-mono">v1.0.0</span>
        </div>
      </div>
    </div>
  );
}
