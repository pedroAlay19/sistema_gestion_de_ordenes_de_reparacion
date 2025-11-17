import { useEffect, useState } from "react";
import {
  KPICard,
  ChartCard,
  ActivityItem,
  AlertCard,
} from "../../components/admin";
import {
  CurrencyDollarIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  WrenchScrewdriverIcon,
  ClockIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { formatDate } from "../../utils/formatDate";
import { useWebSocket } from "../../hooks/useWebSocket";
import { fetchFullDashboard, type FullDashboardData } from "../../api/dashboard-granular";

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<FullDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch inicial de todos los datos
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        console.log("Loading initial dashboard data...");
        const data = await fetchFullDashboard();
        setDashboardData(data);
        console.log("Initial dashboard data loaded");
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // WebSocket para actualizaciones en tiempo real
  useWebSocket({
    onDashboardUpdate: (message) => {
      console.log(`Updating dashboard - Event: ${message.event}`);
      
      // Solo actualizar si ya tenemos datos iniciales cargados
      if (!dashboardData) {
        console.log("⚠️ Ignoring update, waiting for initial data load");
        return;
      }
      
      // Actualizar solo las métricas que vinieron en el mensaje
      setDashboardData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          ...message.data,
        };
      });
    },
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-white text-xl mb-2">No hay datos disponibles</p>
          <p className="text-gray-400">Intenta recargar la página</p>
        </div>
      </div>
    );
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      IN_REVIEW: "En Revisión",
      WAITING_APPROVAL: "Esperando Aprobación",
      REJECTED: "Rechazado",
      IN_REPAIR: "En Reparación",
      WAITING_PARTS: "Esperando Repuestos",
      READY: "Listo",
      DELIVERED: "Entregado",
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">
          Resumen general de las operaciones del taller
        </p>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Órdenes Activas"
          value={dashboardData.orders_overview.activeOrders}
          subtitle="En proceso"
          icon={<ClipboardDocumentListIcon className="w-6 h-6 text-blue-500" />}
          iconBgColor="bg-blue-500/10"
        />
        <KPICard
          title="Facturación Total"
          value={`$${dashboardData.orders_revenue.totalRevenue.toFixed(2)}`}
          subtitle="Órdenes completadas"
          icon={<CurrencyDollarIcon className="w-6 h-6 text-green-500" />}
          iconBgColor="bg-green-500/10"
        />
        <KPICard
          title="Clientes Activos"
          value={dashboardData.users_overview.totalClients}
          subtitle="Registrados"
          icon={<UsersIcon className="w-6 h-6 text-purple-500" />}
          iconBgColor="bg-purple-500/10"
        />
        <KPICard
          title="Técnicos"
          value={`${dashboardData.users_overview.activeTechnicians}/${dashboardData.users_overview.totalTechnicians}`}
          subtitle="Disponibles"
          icon={<WrenchScrewdriverIcon className="w-6 h-6 text-orange-500" />}
          iconBgColor="bg-orange-500/10"
        />
      </div>

      {/* Second Row - Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-lg font-semibold">
              Resumen de Órdenes
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Total</span>
              <span className="text-white font-semibold">
                {dashboardData.orders_overview.totalOrders}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Completadas</span>
              <span className="text-green-400 font-semibold">
                {dashboardData.orders_overview.completedOrders}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">En Proceso</span>
              <span className="text-blue-400 font-semibold">
                {dashboardData.orders_overview.activeOrders}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Costo Promedio</span>
              <span className="text-white font-semibold">
                ${dashboardData.orders_revenue.averageCost.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-lg font-semibold">
              Servicios Principales
            </h3>
          </div>
          <div className="space-y-3">
            {dashboardData.orders_top_services.topServices.slice(0, 4).map((service, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {service.serviceName}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {service.count} servicios
                  </p>
                </div>
                <span className="text-green-400 font-semibold text-sm">
                  ${service.revenue.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-lg font-semibold">Top Clientes</h3>
          </div>
          <div className="space-y-3">
            {dashboardData.users_top_clients.topClients.slice(0, 4).map((client, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {client.name}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {client.totalOrders} órdenes
                  </p>
                </div>
                <span className="text-green-400 font-semibold text-sm">
                  ${client.totalSpent.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders by Status */}
        <ChartCard title="Órdenes por Estado" subtitle="Distribución actual">
          <div className="space-y-3">
            {dashboardData.orders_by_status.ordersByStatus
              .filter((item) => item.count > 0)
              .map((item, index) => {
                const percentage = (
                  (item.count / (dashboardData.orders_overview.totalOrders || 1)) *
                  100
                ).toFixed(1);
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm">
                        {getStatusLabel(item.status)}
                      </span>
                      <span className="text-white font-medium text-sm">
                        {item.count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </ChartCard>

        {/* Top Technicians */}
        <ChartCard title="Mejores Técnicos" subtitle="Por órdenes completadas">
          <div className="space-y-4">
            {dashboardData.users_top_technicians.topTechnicians.slice(0, 5).map((tech, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-white font-semibold text-sm">
                    {tech.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">
                    {tech.name}
                  </p>
                  <p className="text-gray-400 text-xs">{tech.specialty}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold text-sm">
                    {tech.completedOrders}
                  </p>
                  <p className="text-gray-500 text-xs">órdenes</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-semibold text-sm">
                    ${tech.revenue.toFixed(0)}
                  </p>
                  <p className="text-gray-500 text-xs">ingresos</p>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <ChartCard
            title="Actividad Reciente"
            subtitle="Últimas órdenes registradas"
          >
            <div className="space-y-2">
              {dashboardData.orders_recent.recentOrders.map((order, index) => {
                const isCompleted = order.status === "DELIVERED";
                return (
                  <ActivityItem
                    key={index}
                    icon={
                      isCompleted ? (
                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                      ) : (
                        <ClockIcon className="w-5 h-5 text-blue-500" />
                      )
                    }
                    title={`#${order.id.slice(0, 8)} - ${order.equipmentName}`}
                    description={`${order.clientName} - ${getStatusLabel(
                      order.status
                    )}`}
                    time={formatDate(order.createdAt)}
                    iconBgColor={
                      isCompleted ? "bg-green-500/10" : "bg-blue-500/10"
                    }
                  />
                );
              })}
            </div>
          </ChartCard>
        </div>

        {/* Alerts */}
        <div>
          <ChartCard title="Alertas" subtitle="Requieren atención">
            <div className="space-y-3">
              {dashboardData.orders_by_status.ordersByStatus
                .filter(
                  (item) => item.status === "WAITING_APPROVAL" && item.count > 0
                )
                .map((item, index) => (
                  <AlertCard
                    key={index}
                    type="warning"
                    title="Órdenes Pendientes"
                    message={`${item.count} órdenes esperando aprobación`}
                  />
                ))}
              {dashboardData.orders_by_status.ordersByStatus
                .filter(
                  (item) => item.status === "WAITING_PARTS" && item.count > 0
                )
                .map((item, index) => (
                  <AlertCard
                    key={index}
                    type="info"
                    title="Repuestos Pendientes"
                    message={`${item.count} órdenes esperando repuestos`}
                  />
                ))}
              {!dashboardData.orders_by_status.ordersByStatus.some(
                (item) =>
                  (item.status === "WAITING_APPROVAL" ||
                    item.status === "WAITING_PARTS") &&
                  item.count > 0
              ) && (
                <div className="text-center py-8">
                  <CheckCircleIcon className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">Todo está al día</p>
                </div>
              )}
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
