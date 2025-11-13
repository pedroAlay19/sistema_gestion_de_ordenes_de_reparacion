import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  WrenchScrewdriverIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { StatCard, Card, ProgressBar } from "../../components/ui";
import { OrderStatsChart } from "../../components/charts";
import { useAuth } from "../../hooks/useAuth";
import { OrderRepairStatus, type RepairOrder } from "../../types";

export default function TechnicianDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<RepairOrder[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        const { repairOrders } = await import("../../api");
        const data = await repairOrders.getAll();
        setOrders(data);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Calcular estadísticas desde los datos reales
  const stats = {
    assigned: orders.length,
    inProgress: orders.filter((o) => o.status === OrderRepairStatus.IN_REPAIR)
      .length,
    completed: orders.filter((o) => o.status === OrderRepairStatus.DELIVERED)
      .length,
    pending: orders.filter(
      (o) =>
        o.status === OrderRepairStatus.IN_REVIEW ||
        o.status === OrderRepairStatus.WAITING_APPROVAL
    ).length,
  };

  const orderStats = [
    { name: "Completadas", value: stats.completed, color: "#10b981" },
    { name: "En Progreso", value: stats.inProgress, color: "#3b82f6" },
    { name: "Pendientes", value: stats.pending, color: "#f59e0b" },
  ];

  const overallProgress =
    stats.assigned > 0
      ? Math.round((stats.completed / stats.assigned) * 100)
      : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-900 text-xl font-medium">
          Cargando dashboard...
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold text-gray-900">
              Bienvenido, {user?.name}
            </h1>
          </div>
          <p className="text-gray-600">
            Dashboard de técnico - Vista general de tu carga de trabajo
          </p>
        </div>
      </div>

      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Órdenes Asignadas"
              value={stats.assigned}
              icon={WrenchScrewdriverIcon}
              color="blue"
            />
            <StatCard
              title="En Progreso"
              value={stats.inProgress}
              icon={ClockIcon}
              color="yellow"
            />
            <StatCard
              title="Completadas"
              value={stats.completed}
              icon={CheckCircleIcon}
              color="green"
              trend={{ value: 12, isPositive: true }}
            />
            <StatCard
              title="Evaluaciones Pendientes"
              value={stats.pending}
              icon={ExclamationTriangleIcon}
              color="red"
            />
          </div>

          {/* Progress Overview */}
          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Progreso General
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Tu desempeño este mes
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900">
                    {overallProgress}%
                  </p>
                  <p className="text-sm text-gray-600">Completado</p>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <ProgressBar
                progress={overallProgress}
                color="green"
                height="lg"
                animated
              />
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {stats.completed}
                  </p>
                  <p className="text-sm text-gray-600">Completadas</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.inProgress}
                  </p>
                  <p className="text-sm text-gray-600">En Progreso</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">
                    {stats.pending}
                  </p>
                  <p className="text-sm text-gray-600">Pendientes</p>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <OrderStatsChart
              data={orderStats}
              title="Distribución de Órdenes"
            />
          </div>

          {/* Quick Actions */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold text-gray-900">
                Acciones Rápidas
              </h3>
            </Card.Header>
            <Card.Body>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  to="/technician/orders"
                  className="flex items-center gap-4 p-4 rounded-lg border-2 border-gray-200 hover:border-blue-600 hover:bg-blue-50 transition-all group"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                    <WrenchScrewdriverIcon className="w-6 h-6 text-blue-600 group-hover:text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Ver Órdenes</h4>
                    <p className="text-sm text-gray-600">
                      Gestionar asignaciones
                    </p>
                  </div>
                </Link>

                <Link
                  to="/technician/orders?filter=pending"
                  className="flex items-center gap-4 p-4 rounded-lg border-2 border-gray-200 hover:border-yellow-600 hover:bg-yellow-50 transition-all group"
                >
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-600 transition-colors">
                    <ClockIcon className="w-6 h-6 text-yellow-600 group-hover:text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Pendientes</h4>
                    <p className="text-sm text-gray-600">
                      {stats.pending} evaluaciones
                    </p>
                  </div>
                </Link>

                <Link
                  to="/technician/profile"
                  className="flex items-center gap-4 p-4 rounded-lg border-2 border-gray-200 hover:border-green-600 hover:bg-green-50 transition-all group"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-600 transition-colors">
                    <CheckCircleIcon className="w-6 h-6 text-green-600 group-hover:text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Mi Perfil</h4>
                    <p className="text-sm text-gray-600">Ver estadísticas</p>
                  </div>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </>
  );
}
