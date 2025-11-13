import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import { RepairOrderCard } from "../../components/repairOrders";
import type { RepairOrder } from "../../types";
import { OrderRepairStatus } from "../../types";
import { getRepairOrdersByEvaluator } from "../../api";

export default function AssignedOrders() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState<RepairOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const filterStatus = searchParams.get("filter") || "all";

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getRepairOrdersByEvaluator();
        setOrders(data);
      } catch (error) {
        console.error("Error cargando órdenes:", error);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const getFilteredOrders = () => {
    let filtered = orders;

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter((order) => {
        if (filterStatus === "pending")
          return order.status === OrderRepairStatus.IN_REVIEW;
        if (filterStatus === "in-progress")
          return order.status === OrderRepairStatus.IN_REPAIR;
        if (filterStatus === "completed")
          return (
            order.status === OrderRepairStatus.READY ||
            order.status === OrderRepairStatus.DELIVERED
          );
        return true;
      });
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(term) ||
          order.equipment.name.toLowerCase().includes(term) ||
          order.equipment.brand.toLowerCase().includes(term) ||
          order.equipment.user?.name.toLowerCase().includes(term)
      );
    }

    return filtered;
  };

  const filteredOrders = getFilteredOrders();

  const setFilter = (filter: string) => {
    setSearchParams({ filter });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-900 text-xl font-medium">
          Cargando órdenes...
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
              Órdenes Asignadas
            </h1>
          </div>
          <p className="text-gray-600">
            Órdenes de reparación asignadas
          </p>
        </div>
      </div>

      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Search and Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por orden, equipo, cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    filterStatus === "all"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white border border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  <FunnelIcon className="w-4 h-4" />
                  Todas
                </button>
                <button
                  onClick={() => setFilter("pending")}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                    filterStatus === "pending"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white border border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  Pendientes
                </button>
                <button
                  onClick={() => setFilter("in-progress")}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                    filterStatus === "in-progress"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white border border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  En Progreso
                </button>
                <button
                  onClick={() => setFilter("completed")}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                    filterStatus === "completed"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white border border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  Completadas
                </button>
              </div>
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm text-center py-16">
              <div className="p-6">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <WrenchScrewdriverIcon className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {searchTerm
                    ? "No se encontraron resultados"
                    : "No tienes órdenes asignadas"}
                </h3>
                <p className="text-gray-600">
                  {searchTerm
                    ? "Intenta con otros términos de búsqueda"
                    : "Las órdenes asignadas aparecerán aquí"}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <Link
                  key={order.id}
                  to={`/technician/orders/${order.id}`}
                  className="block"
                >
                  <RepairOrderCard order={order} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
