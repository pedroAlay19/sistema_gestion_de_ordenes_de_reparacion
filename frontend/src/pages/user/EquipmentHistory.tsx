import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  ClockIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { equipments as equipmentsApi, repairOrders } from "../../api";
import type { Equipment } from "../../types/equipment.types";
import type { RepairOrder } from "../../types/repair-order.types";
import { OrderRepairStatus } from "../../types/repair-order.types";
import { formatDate } from "../../utils";

export default function EquipmentHistory() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [historyOrders, setHistoryOrders] = useState<RepairOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [orderCosts, setOrderCosts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (id) {
      loadEquipmentHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadEquipmentHistory = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      // Cargar equipo
      const equipmentData = await equipmentsApi.getById(id);
      setEquipment(equipmentData);

      // Cargar historial de órdenes
      const orders = await repairOrders.getByEquipment(id);
      // Filtrar solo las órdenes entregadas
      const deliveredOrders = orders.filter(
        (o) => o.status === OrderRepairStatus.DELIVERED
      );
      setHistoryOrders(deliveredOrders);

      // Cargar costos finales para cada orden
      const costs: Record<string, number> = {};
      await Promise.all(
        deliveredOrders.map(async (order) => {
          try {
            const finalCost = await repairOrders.getByFinalCost(order.id);
            costs[order.id] = finalCost;
          } catch (error) {
            console.error(`Error cargando costo final de orden ${order.id}:`, error);
            costs[order.id] = 0;
          }
        })
      );
      setOrderCosts(costs);
    } catch (error) {
      console.error("Error cargando historial:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando historial...</p>
        </div>
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Equipo no encontrado
          </h3>
          <button
            onClick={() => navigate(-1)}
            className="text-slate-700 hover:text-slate-900 font-medium"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-slate-900 border-b border-gray-800 px-8 py-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="font-medium">Volver</span>
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center">
              <ClockIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl text-white">
                Historial de Reparaciones
              </h1>
              <p className="text-slate-300 mt-1">{equipment.name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Equipment Info Card */}
      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Marca
              </p>
              <p className="text-lg text-gray-900">{equipment.brand}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Modelo
              </p>
              <p className="text-lg text-gray-900">{equipment.model}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Tipo
              </p>
              <p className="text-lg text-gray-900">{equipment.type}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Serial
              </p>
              <p className="text-lg font-mono text-gray-900">
                {equipment.serialNumber || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* History Content */}
        {historyOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 text-center py-16 px-6">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ClockIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl text-gray-900 mb-2">
              Sin historial de reparaciones
            </h3>
            <p className="text-gray-600 mb-6">
              Este equipo aún no tiene reparaciones completadas.
            </p>
            <button
              onClick={() => navigate("/user/equipments")}
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors"
            >
              Volver a Equipos
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <h2 className="text-xl text-gray-900">
                Reparaciones Completadas
              </h2>
              <p className="text-gray-600 mt-1">
                {historyOrders.length} reparación
                {historyOrders.length !== 1 ? "es" : ""} en total
              </p>
            </div>

            <div className="space-y-4">
              {historyOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
                >
                  {/* Order Header */}
                  <button
                    onClick={() => toggleOrderExpansion(order.id)}
                    className="w-full bg-gradient-to-r from-slate-50 to-white px-6 py-5 flex items-center justify-between hover:from-slate-100 hover:to-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-4 text-left">
                      <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                        <ClockIcon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className=" text-gray-900 text-lg">
                            Orden #{order.id.slice(0, 8)}
                          </span>
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                            Entregada
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-2xl text-slate-900">
                          ${orderCosts[order.id] ?? 0}
                        </p>
                        <p className="text-xs text-gray-500 tracking-wide font-semibold">
                          Costo total
                        </p>
                      </div>
                      <div className="w-10 h-10 flex items-center justify-center">
                        {expandedOrderId === order.id ? (
                          <ChevronUpIcon className="w-6 h-6 text-gray-400" />
                        ) : (
                          <ChevronDownIcon className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {expandedOrderId === order.id && (
                    <div className="border-t border-gray-200 bg-gradient-to-b from-gray-50 to-white">
                      {/* Diagnosis */}
                      {order.diagnosis && (
                        <div className="px-6 py-5 border-b border-gray-100">
                          <h5 className="text-xs text-gray-500 uppercase tracking-wider mb-3">
                            Diagnóstico del Técnico
                          </h5>
                          <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {order.diagnosis}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Services */}
                      {order.repairOrderDetails &&
                        order.repairOrderDetails.length > 0 && (
                          <div className="px-6 py-5 border-b border-gray-100">
                            <h5 className="text-xs text-gray-500 uppercase tracking-wider mb-3">
                              Servicios Realizados
                            </h5>
                            <div className="space-y-3">
                              {order.repairOrderDetails.map((detail) => (
                                <div
                                  key={detail.id}
                                  className="bg-white border border-gray-200 rounded-lg p-4 hover:border-slate-300 transition-colors"
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <p className="font-semibold text-gray-900 mb-1">
                                        {detail.service.serviceName}
                                      </p>
                                      <p className="text-xs text-gray-600 mb-2">
                                        Técnico: {detail.technician.name}
                                      </p>
                                      {detail.notes && (
                                        <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 mt-2">
                                          <p className="text-xs text-gray-600 italic">
                                            "{detail.notes}"
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                    <span className="text-lg font-semibold text-slate-900 ml-4">
                                      ${detail.repairPrice}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      {/* Parts */}
                      {order.repairOrderParts &&
                        order.repairOrderParts.length > 0 && (
                          <div className="px-6 py-5">
                            <h5 className="text-xs text-gray-500 uppercase tracking-wider mb-3">
                              Piezas Utilizadas
                            </h5>
                            <div className="space-y-3">
                              {order.repairOrderParts.map((part) => (
                                <div
                                  key={part.id}
                                  className="bg-white border border-gray-200 rounded-lg p-4 hover:border-slate-300 transition-colors"
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <p className="font-semibold text-gray-900 mb-1">
                                        {part.part.name}
                                      </p>
                                      <p className="text-xs text-gray-600">
                                        {part.part.description}
                                      </p>
                                    </div>
                                    <div className="text-right ml-4">
                                      <p className="text-sm text-gray-600">
                                        {part.quantity} x ${part.part.unitPrice}
                                      </p>
                                      <p className="text-lg font-semibold text-slate-900">
                                        $
                                        {part.subTotal}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
