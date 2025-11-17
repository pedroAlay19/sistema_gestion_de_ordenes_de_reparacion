import { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { getRepairOrders } from "../../api";
import { OrderRepairStatus, type RepairOrder } from "../../types";
import { getOrderStatusText } from "../../utils/statusUtils";

export default function OrdersManagement() {
  const [orders, setOrders] = useState<RepairOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderRepairStatus | "all">("all");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const data = await getRepairOrders();
        setOrders(data);
      } catch (error) {
        console.error("Error loading orders:", error);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const getStatusColor = (status: OrderRepairStatus) => {
    const colors: Record<OrderRepairStatus, string> = {
      [OrderRepairStatus.IN_REVIEW]: "bg-blue-500/10 text-blue-500",
      [OrderRepairStatus.WAITING_APPROVAL]: "bg-yellow-500/10 text-yellow-500",
      [OrderRepairStatus.REJECTED]: "bg-red-500/10 text-red-500",
      [OrderRepairStatus.IN_REPAIR]: "bg-purple-500/10 text-purple-500",
      [OrderRepairStatus.WAITING_PARTS]: "bg-orange-500/10 text-orange-500",
      [OrderRepairStatus.READY]: "bg-green-500/10 text-green-500",
      [OrderRepairStatus.DELIVERED]: "bg-green-600/10 text-green-600",
    };
    return colors[status] || "bg-gray-500/10 text-gray-500";
  };

  const filteredOrders = orders.filter((order) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = searchTerm === "" || 
      order.problemDescription?.toLowerCase().includes(searchLower) ||
      order.equipment?.user?.name?.toLowerCase().includes(searchLower) ||
      order.equipment?.name?.toLowerCase().includes(searchLower) ||
      order.evaluatedBy?.name?.toLowerCase().includes(searchLower) ||
      order.id?.toLowerCase().includes(searchLower);

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Órdenes de Reparación</h1>
          <p className="text-gray-400 mt-1">
            Gestión de todas las órdenes de reparación
          </p>
        </div>
        <button
          onClick={() => {
            setSidebarCollapsed(!sidebarCollapsed);
            const sidebar = document.querySelector('.lg\\:fixed.lg\\:inset-y-0') as HTMLElement;
            const mainContent = document.querySelector('.lg\\:pl-64') as HTMLElement;
            if (sidebar && mainContent) {
              if (!sidebarCollapsed) {
                sidebar.style.display = 'none';
                mainContent.style.paddingLeft = '0';
              } else {
                sidebar.style.display = 'flex';
                mainContent.style.paddingLeft = '16rem';
              }
            }
          }}
          className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
        >
          <Bars3Icon className="w-5 h-5" />
          {sidebarCollapsed ? 'Mostrar' : 'Ocultar'} Menú
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-linear-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 rounded-lg p-4">
          <p className="text-gray-300 text-xs font-medium">Total</p>
          <p className="text-2xl font-bold text-white mt-1">{orders.length}</p>
        </div>
        <div className="bg-linear-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-4">
          <p className="text-gray-300 text-xs font-medium">🔍 En Revisión</p>
          <p className="text-2xl font-bold text-purple-400 mt-1">
            {orders.filter((o) => o.status === OrderRepairStatus.IN_REVIEW).length}
          </p>
        </div>
        <div className="bg-linear-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-gray-300 text-xs font-medium">⏳ Esperando</p>
          <p className="text-2xl font-bold text-yellow-400 mt-1">
            {orders.filter((o) => o.status === OrderRepairStatus.WAITING_APPROVAL).length}
          </p>
        </div>
        <div className="bg-linear-to-br from-indigo-500/20 to-blue-500/20 border border-indigo-500/30 rounded-lg p-4">
          <p className="text-gray-300 text-xs font-medium">🔧 En Reparación</p>
          <p className="text-2xl font-bold text-indigo-400 mt-1">
            {orders.filter((o) => o.status === OrderRepairStatus.IN_REPAIR).length}
          </p>
        </div>
        <div className="bg-linear-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-lg p-4">
          <p className="text-gray-300 text-xs font-medium">📦 Esperando Piezas</p>
          <p className="text-2xl font-bold text-orange-400 mt-1">
            {orders.filter((o) => o.status === OrderRepairStatus.WAITING_PARTS).length}
          </p>
        </div>
        <div className="bg-linear-to-br from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-lg p-4">
          <p className="text-gray-300 text-xs font-medium">❌ Rechazadas</p>
          <p className="text-2xl font-bold text-red-400 mt-1">
            {orders.filter((o) => o.status === OrderRepairStatus.REJECTED).length}
          </p>
        </div>
        <div className="bg-linear-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-4">
          <p className="text-gray-300 text-xs font-medium">✅ Listas</p>
          <p className="text-2xl font-bold text-green-400 mt-1">
            {orders.filter((o) => o.status === OrderRepairStatus.READY).length}
          </p>
        </div>
        <div className="bg-linear-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-lg p-4">
          <p className="text-gray-300 text-xs font-medium">🎉 Entregadas</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">
            {orders.filter((o) => o.status === OrderRepairStatus.DELIVERED).length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por descripción, cliente o equipo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderRepairStatus | "all")}
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value={OrderRepairStatus.IN_REVIEW}>{getOrderStatusText(OrderRepairStatus.IN_REVIEW)}</option>
              <option value={OrderRepairStatus.WAITING_APPROVAL}>{getOrderStatusText(OrderRepairStatus.WAITING_APPROVAL)}</option>
              <option value={OrderRepairStatus.REJECTED}>{getOrderStatusText(OrderRepairStatus.REJECTED)}</option>
              <option value={OrderRepairStatus.IN_REPAIR}>{getOrderStatusText(OrderRepairStatus.IN_REPAIR)}</option>
              <option value={OrderRepairStatus.WAITING_PARTS}>{getOrderStatusText(OrderRepairStatus.WAITING_PARTS)}</option>
              <option value={OrderRepairStatus.READY}>{getOrderStatusText(OrderRepairStatus.READY)}</option>
              <option value={OrderRepairStatus.DELIVERED}>{getOrderStatusText(OrderRepairStatus.DELIVERED)}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Orden & Problema
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Cliente & Equipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Técnico
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Costo
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    No se encontraron órdenes
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-gray-400 font-mono text-xs">#{order.id.slice(0, 8)}</p>
                        <p className="text-white text-sm font-medium max-w-md truncate">
                          {order.problemDescription}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {new Date(order.createdAt).toLocaleDateString("es-ES", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-white text-sm font-medium">{order.equipment.user?.name || "-"}</p>
                        <p className="text-gray-400 text-xs">{order.equipment.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-300 text-sm">{order.evaluatedBy?.name || "-"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <span
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getOrderStatusText(order.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-white text-sm font-semibold">
                        ${order.finalCost ? order.finalCost : "0.00"}
                      </p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
