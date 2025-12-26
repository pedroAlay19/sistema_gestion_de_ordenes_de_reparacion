import { useState, useEffect, type JSX } from "react";
import {
  FunnelIcon,
  DocumentArrowDownIcon,
  ArrowDownTrayIcon,
  ChevronRightIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import { repairOrders } from "../../api";
import { OrderRepairStatus, type RepairOrder } from "../../types/repair-order.types";
import { getOrderStatusText } from "../../utils/statusUtils";
import { generateRepairOrderReport, generateRepairOrdersByStatusReport } from "../../api/reports";
import { downloadPdfFromBase64 } from "../../utils/pdfDownload";

export default function OrdersManagement() {
  const [orders, setOrders] = useState<RepairOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<OrderRepairStatus | "all">("all");
  const [selectedOrder, setSelectedOrder] = useState<RepairOrder | null>(null);
  const [generatingReportId, setGeneratingReportId] = useState<string | null>(null);
  const [generatingStatusReport, setGeneratingStatusReport] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const data = await repairOrders.getAll();
        setOrders(data);
      } catch (error) {
        console.error("Error loading orders:", error);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const getStatusInfo = (status: OrderRepairStatus) => {
    const statusMap: Record<OrderRepairStatus, { color: string; bgColor: string; icon: JSX.Element; label: string }> = {
      [OrderRepairStatus.IN_REVIEW]: {
        color: "text-blue-400",
        bgColor: "bg-blue-500/10 border-blue-500/20",
        icon: <ClockIcon className="w-4 h-4" />,
        label: "En Revisión"
      },
      [OrderRepairStatus.WAITING_APPROVAL]: {
        color: "text-yellow-400",
        bgColor: "bg-yellow-500/10 border-yellow-500/20",
        icon: <ClockIcon className="w-4 h-4" />,
        label: "Esperando Aprobación"
      },
      [OrderRepairStatus.REJECTED]: {
        color: "text-red-400",
        bgColor: "bg-red-500/10 border-red-500/20",
        icon: <XCircleIcon className="w-4 h-4" />,
        label: "Rechazado"
      },
      [OrderRepairStatus.IN_REPAIR]: {
        color: "text-purple-400",
        bgColor: "bg-purple-500/10 border-purple-500/20",
        icon: <WrenchScrewdriverIcon className="w-4 h-4" />,
        label: "En Reparación"
      },
      [OrderRepairStatus.READY]: {
        color: "text-emerald-400",
        bgColor: "bg-emerald-500/10 border-emerald-500/20",
        icon: <CheckCircleIcon className="w-4 h-4" />,
        label: "Listo"
      },
      [OrderRepairStatus.DELIVERED]: {
        color: "text-green-400",
        bgColor: "bg-green-500/10 border-green-500/20",
        icon: <CheckCircleIcon className="w-4 h-4" />,
        label: "Entregado"
      },
    };
    return statusMap[status];
  };

  const handleGenerateReport = async (orderId: string) => {
    try {
      setGeneratingReportId(orderId);
      const base64Pdf = await generateRepairOrderReport(orderId);
      const shortId = orderId.slice(0, 8);
      downloadPdfFromBase64(base64Pdf, `reporte-orden-${shortId}.pdf`);
    } catch (error: unknown) {
      console.error("Error al generar reporte:", error);
      alert(`Error al generar el reporte:\n${error instanceof Error ? error.message : "Error desconocido"}`);
    } finally {
      setGeneratingReportId(null);
    }
  };

  const handleGenerateStatusReport = async (status: OrderRepairStatus) => {
    try {
      setGeneratingStatusReport(status);
      const base64Pdf = await generateRepairOrdersByStatusReport(status);
      const statusName = getOrderStatusText(status).toLowerCase().replace(/\s+/g, '-');
      downloadPdfFromBase64(base64Pdf, `reporte-ordenes-${statusName}.pdf`);
    } catch (error: unknown) {
      console.error("Error al generar reporte por estado:", error);
      alert(`Error al generar el reporte:\n${error instanceof Error ? error.message : "Error desconocido"}`);
    } finally {
      setGeneratingStatusReport(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="flex">
        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${selectedOrder ? 'mr-96' : ''}`}>
          <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Órdenes de Reparación</h1>
                <p className="text-gray-400">
                  Gestión completa de {orders.length} órdenes del sistema
                </p>
              </div>
              
              {/* Report Buttons */}
              <div className="flex items-center gap-3">
                {Object.values(OrderRepairStatus).map((status) => {
                  const statusInfo = getStatusInfo(status);
                  const count = orders.filter((o) => o.status === status).length;
                  if (count === 0) return null;
                  
                  return (
                    <button
                      key={status}
                      onClick={() => handleGenerateStatusReport(status)}
                      disabled={generatingStatusReport === status}
                      className={`flex items-center gap-2 px-4 py-2 ${statusInfo.bgColor} border rounded-lg ${statusInfo.color} hover:opacity-80 transition-all disabled:opacity-50`}
                      title={`Descargar reporte de ${statusInfo.label}`}
                    >
                      {generatingStatusReport === status ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      ) : (
                        <ArrowDownTrayIcon className="w-4 h-4" />
                      )}
                      <span className="text-sm font-medium">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-xs">
                <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value as OrderRepairStatus | "all");
                    setSelectedOrder(null);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-900/50 border border-gray-800 rounded-lg text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-colors appearance-none cursor-pointer hover:bg-gray-900/70"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                  }}
                >
                  <option value="all" className="bg-gray-900 text-gray-300">Todos los estados ({orders.length})</option>
                  {Object.values(OrderRepairStatus).map((status) => {
                    const count = orders.filter((o) => o.status === status).length;
                    return (
                      <option key={status} value={status} className="bg-gray-900 text-gray-300">
                        {getOrderStatusText(status)} ({count})
                      </option>
                    );
                  })}
                </select>
              </div>
              
              <div className="text-sm text-gray-500">
                Mostrando {filteredOrders.length} de {orders.length} órdenes
              </div>
            </div>

            {/* Table */}
            {loading ? (
              <div className="flex items-center justify-center py-32 bg-gray-900/50 border border-gray-800 rounded-lg">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-400">Cargando órdenes...</p>
                </div>
              </div>
            ) : (
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="px-6 py-4 text-left">
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Orden
                          </span>
                        </th>
                        <th className="px-6 py-4 text-left">
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Problema
                          </span>
                        </th>
                        <th className="px-6 py-4 text-left">
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Cliente
                          </span>
                        </th>
                        <th className="px-6 py-4 text-left">
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Estado
                          </span>
                        </th>
                        <th className="px-6 py-4 text-right">
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Acciones
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-16 text-center">
                            <div className="flex flex-col items-center gap-3">
                              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
                                <DocumentArrowDownIcon className="w-8 h-8 text-gray-600" />
                              </div>
                              <p className="text-gray-500 font-medium">No se encontraron órdenes</p>
                              <p className="text-sm text-gray-600">Cambia los filtros para ver más resultados</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((order) => {
                          const statusInfo = getStatusInfo(order.status);
                          const isSelected = selectedOrder?.id === order.id;
                          
                          return (
                            <tr
                              key={order.id}
                              onClick={() => setSelectedOrder(order)}
                              className={`cursor-pointer transition-colors ${
                                isSelected 
                                  ? 'bg-emerald-500/5 border-l-2 border-emerald-500' 
                                  : 'hover:bg-gray-800/50'
                              }`}
                            >
                              <td className="px-6 py-4">
                                <div className="space-y-1">
                                  <p className="text-gray-400 font-mono text-xs">
                                    #{order.id.slice(0, 8).toUpperCase()}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {new Date(order.createdAt).toLocaleDateString("es-ES", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric"
                                    })}
                                  </p>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="max-w-xs">
                                  <p className="text-sm text-white truncate font-medium">
                                    {order.problemDescription}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {order.equipment.name}
                                  </p>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <p className="text-sm text-gray-300">
                                  {order.equipment.user?.name || "-"}
                                </p>
                              </td>
                              <td className="px-6 py-4">
                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 ${statusInfo.bgColor} border rounded-lg`}>
                                  <span className={statusInfo.color}>
                                    {statusInfo.icon}
                                  </span>
                                  <span className={`text-xs font-medium ${statusInfo.color}`}>
                                    {statusInfo.label}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleGenerateReport(order.id);
                                    }}
                                    disabled={generatingReportId === order.id}
                                    className="p-2 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors disabled:opacity-50"
                                    title="Generar reporte PDF"
                                  >
                                    {generatingReportId === order.id ? (
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-400"></div>
                                    ) : (
                                      <DocumentArrowDownIcon className="w-4 h-4" />
                                    )}
                                  </button>
                                  <ChevronRightIcon className="w-4 h-4 text-gray-600" />
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Detail */}
        {selectedOrder && (
          <div className="fixed right-0 top-0 h-screen w-96 bg-gray-900 border-l border-gray-800 shadow-2xl overflow-y-auto z-40">
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-gray-800">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-gray-500">
                      #{selectedOrder.id.slice(0, 8).toUpperCase()}
                    </span>
                    {(() => {
                      const statusInfo = getStatusInfo(selectedOrder.status);
                      return (
                        <div className={`inline-flex items-center gap-1.5 px-2 py-1 ${statusInfo.bgColor} border rounded-md`}>
                          <span className={statusInfo.color}>
                            {statusInfo.icon}
                          </span>
                          <span className={`text-xs font-medium ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        </div>
                      );
                    })()}
                  </div>
                  <h2 className="text-lg font-semibold text-white">Detalles de la Orden</h2>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <XCircleIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Details Sections */}
              <div className="space-y-4">
                {/* Problem */}
                <div className="bg-gray-800/50 border border-gray-800 rounded-lg p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                    Problema Reportado
                  </p>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {selectedOrder.problemDescription}
                  </p>
                </div>

                {/* Equipment */}
                <div className="bg-gray-800/50 border border-gray-800 rounded-lg p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
                    Equipo
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Nombre</span>
                      <span className="text-sm text-white font-medium">
                        {selectedOrder.equipment.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Marca</span>
                      <span className="text-sm text-gray-300">
                        {selectedOrder.equipment.brand}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Modelo</span>
                      <span className="text-sm text-gray-300">
                        {selectedOrder.equipment.model}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Client */}
                <div className="bg-gray-800/50 border border-gray-800 rounded-lg p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                    Cliente
                  </p>
                  <p className="text-sm text-white font-medium">
                    {selectedOrder.equipment.user?.name || "No especificado"}
                  </p>
                </div>

                {/* Technician */}
                {selectedOrder.evaluatedBy && (
                  <div className="bg-gray-800/50 border border-gray-800 rounded-lg p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                      Técnico Evaluador
                    </p>
                    <p className="text-sm text-white font-medium">
                      {selectedOrder.evaluatedBy.name}
                    </p>
                  </div>
                )}

                {/* Diagnosis */}
                {selectedOrder.diagnosis && (
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
                    <p className="text-xs font-semibold text-blue-400 uppercase mb-2">
                      Diagnóstico
                    </p>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {selectedOrder.diagnosis}
                    </p>
                    {selectedOrder.estimatedCost && (
                      <div className="mt-3 pt-3 border-t border-blue-500/20">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-blue-400">Costo Estimado</span>
                          <span className="text-lg font-bold text-blue-400">
                            ${Number(selectedOrder.estimatedCost).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Dates */}
                <div className="bg-gray-800/50 border border-gray-800 rounded-lg p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
                    Fechas
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Creación</span>
                      <span className="text-xs text-gray-300">
                        {new Date(selectedOrder.createdAt).toLocaleString("es-ES")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Actualización</span>
                      <span className="text-xs text-gray-300">
                        {new Date(selectedOrder.updatedAt).toLocaleString("es-ES")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <button
                  onClick={() => handleGenerateReport(selectedOrder.id)}
                  disabled={generatingReportId === selectedOrder.id}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                >
                  {generatingReportId === selectedOrder.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-400"></div>
                      <span className="text-sm font-medium">Generando...</span>
                    </>
                  ) : (
                    <>
                      <DocumentArrowDownIcon className="w-5 h-5" />
                      <span className="text-sm font-medium">Descargar Reporte PDF</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
