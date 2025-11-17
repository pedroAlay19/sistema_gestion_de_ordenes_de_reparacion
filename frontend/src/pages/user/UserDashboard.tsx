import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getEquipments, getRepairOrders } from "../../api/api";
import type { Equipment } from "../../types/equipment.types";
import type { RepairOrder } from "../../types/repair-order.types";
import { OrderRepairStatus } from "../../types";

export default function UserDashboard() {
  const { user } = useAuth();
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [orders, setOrders] = useState<RepairOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [equipmentsData, ordersData] = await Promise.all([
          getEquipments(),
          getRepairOrders(),
        ]);
        setEquipments(equipmentsData);
        setOrders(ordersData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const activeOrders = orders.filter(
    (o) =>
      o.status != OrderRepairStatus.DELIVERED &&
      o.status != OrderRepairStatus.REJECTED
  );
  const warrantyCount = 0;

  const getOrderProgress = (status: OrderRepairStatus) => {
    switch (status) {
      case OrderRepairStatus.IN_REVIEW:
        return 15;
      case OrderRepairStatus.WAITING_APPROVAL:
        return 30;
      case OrderRepairStatus.IN_REPAIR:
        return 60;
      case OrderRepairStatus.WAITING_PARTS:
        return 50;
      case OrderRepairStatus.READY:
        return 90;
      case OrderRepairStatus.DELIVERED:
        return 100;
      case OrderRepairStatus.REJECTED:
        return 0;
      default:
        return 0;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-900 text-xl font-medium">Cargando...</div>
      </div>
    );
  }

  return (
    <>
      {/* Top Bar */}
      <div className="bg-slate-900 border-b border-gray-800 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-200">
                  Bienvenido, {user?.name}
                </h1>
              </div>
              <p className="text-gray-400 mt-1">
                Aquí tienes el estado de tus reparaciones
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Widgets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Widget 1: Órdenes Activas */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Órdenes Activas
                  </p>
                  <p className="text-4xl font-bold text-gray-900">
                    {activeOrders.length}
                  </p>
                </div>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center relative">
                  {/* Circular Progress */}
                  <svg
                    className="w-16 h-16 transform -rotate-90"
                    viewBox="0 0 64 64"
                  >
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="6"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="6"
                      strokeDasharray={`${
                        (activeOrders.length / (orders.length || 1)) * 175.93
                      } 175.93`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-sm font-bold text-blue-600">
                    {activeOrders.length}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">En proceso</span>
                <Link
                  to="/user/repair-orders"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Ver todas →
                </Link>
              </div>
            </div>

            {/* Widget 2: Equipos Registrados */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Equipos Registrados
                  </p>
                  <p className="text-4xl font-bold text-gray-900">
                    {equipments.length}
                  </p>
                </div>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Dispositivos totales</span>
                <Link
                  to="/user/equipments"
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  Gestionar →
                </Link>
              </div>
            </div>

            {/* Widget 3: Garantías Vigentes */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Garantías Vigentes
                  </p>
                  <p className="text-4xl font-bold text-gray-900">
                    {warrantyCount}
                  </p>
                </div>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                {warrantyCount > 0 ? (
                  <span className="text-gray-600">Protección activa</span>
                ) : (
                  <span className="text-gray-400">Sin garantías</span>
                )}
                <Link
                  to="/user/equipments"
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Ver detalles →
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-linear-to-br from-black to-gray-800 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-6">Acciones Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/user/equipments/new"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-6 transition-all group"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Agregar Equipo</h3>
                    <p className="text-sm text-white/70">
                      Registra un nuevo dispositivo
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                to="/user/repair-orders/new"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-6 transition-all group"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Nueva Reparación</h3>
                    <p className="text-sm text-white/70">
                      Solicita un servicio
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                to="/user/equipments"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-6 transition-all group"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Ver Equipos</h3>
                    <p className="text-sm text-white/70">
                      Gestiona tus dispositivos
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Órdenes Recientes
              </h2>
              <Link
                to="/user/repair-orders"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Ver historial completo
              </Link>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No tienes órdenes aún
                </h3>
                <p className="text-gray-600 mb-6">
                  Solicita tu primera reparación
                </p>
                <Link
                  to="/user/repair-orders/new"
                  className="inline-block bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors"
                >
                  Nueva Reparación
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 2).map((order) => {
                  const progress = getOrderProgress(order.status);
                  return (
                    <Link
                      key={order.id}
                      to={`/user/repair-orders/${order.id}`}
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group border border-gray-100"
                    >
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                        <svg
                          className="w-6 h-6 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <p className="font-semibold text-gray-900">
                            Orden #{order.id}
                          </p>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              order.status === OrderRepairStatus.IN_REVIEW ||
                              order.status ===
                                OrderRepairStatus.WAITING_APPROVAL
                                ? "bg-yellow-100 text-yellow-800"
                                : order.status ===
                                    OrderRepairStatus.IN_REPAIR ||
                                  order.status ===
                                    OrderRepairStatus.WAITING_PARTS
                                ? "bg-blue-100 text-blue-800"
                                : order.status === OrderRepairStatus.READY
                                ? "bg-purple-100 text-purple-800"
                                : order.status === OrderRepairStatus.DELIVERED
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {order.status === OrderRepairStatus.IN_REVIEW
                              ? "En Revisión"
                              : order.status ===
                                OrderRepairStatus.WAITING_APPROVAL
                              ? "Esperando Aprobación"
                              : order.status === OrderRepairStatus.IN_REPAIR
                              ? "En Reparación"
                              : order.status === OrderRepairStatus.WAITING_PARTS
                              ? "Esperando Piezas"
                              : order.status === OrderRepairStatus.READY
                              ? "Lista"
                              : order.status === OrderRepairStatus.DELIVERED
                              ? "Entregada"
                              : "Rechazada"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {order.equipment.name}
                        </p>
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                      <svg
                        className="w-5 h-5 text-gray-400 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
