import { useEffect, useState } from "react";
import { repairOrders } from "../../api";
import type { RepairOrder } from "../../types/repair-order.types";

export const CostBreakdown: React.FC<{ order: RepairOrder }> = ({ order }) => {
  const [finalCost, setFinalCost] = useState<number>(0);
  const [loadingCost, setLoadingCost] = useState(false);

  // Validar que tengamos datos para mostrar
  const hasServices =
    order.repairOrderDetails && order.repairOrderDetails.length > 0;
  const hasParts = order.repairOrderParts && order.repairOrderParts.length > 0;

  // Calcular subtotales
  const servicesSubtotal = hasServices
    ? order.repairOrderDetails!.reduce((sum, d) => sum + Number(d.repairPrice || 0), 0)
    : 0;

  const partsSubtotal = hasParts
    ? order.repairOrderParts!.reduce(
        (sum, p) => sum + (Number(p.quantity) * Number(p.part?.unitPrice || 0)),
        0
      )
    : 0;

  // Cargar el costo final desde el endpoint
  useEffect(() => {
    const loadFinalCost = async () => {
      if (!order.id) return;
      setLoadingCost(true);
      try {
        const cost = await repairOrders.getByFinalCost(order.id);
        setFinalCost(cost);
      } catch (error) {
        console.error("Error al cargar costo final:", error);
        setFinalCost(0);
      } finally {
        setLoadingCost(false);
      }
    };

    if (hasServices || hasParts) {
      loadFinalCost();
    }
  }, [order.id, hasServices, hasParts]);

  // No mostrar el componente si no hay servicios ni piezas
  if (!hasServices && !hasParts) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-linear-to-r from-slate-900 to-slate-800 p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-xl text-white">Desglose de Costos</h3>
            <p className="text-slate-300 text-sm mt-0.5">
              Detalle completo de la reparación
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Services Section */}
        {hasServices && (
          <div>
            <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-4">
              Servicios Realizados
            </h4>
            <div className="space-y-3">
              {order.repairOrderDetails!.map((detail) => (
                <div
                  key={detail.id}
                  className="flex items-start justify-between p-4 bg-blue-50 rounded-xl border border-blue-200 hover:bg-blue-100 transition-colors"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-gray-900">
                        {detail.service?.serviceName || "Servicio"}
                      </p>
                      <span className="text-lg text-slate-900 ml-3 shrink-0">
                        ${Number(detail.repairPrice || 0).toFixed(2)}
                      </span>
                    </div>
                    {detail.technician && (
                      <p className="text-sm text-gray-600 mb-2">
                        Tecnico {detail.technician.name}
                      </p>
                    )}
                    {detail.notes && (
                      <div className="bg-white border border-slate-200 rounded-lg p-3 mt-2">
                        <p className="text-xs text-gray-600 italic leading-relaxed">
                          "{detail.notes}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t-2 border-slate-200 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-700">
                Subtotal Servicios
              </p>
              <p className="text-xl text-gray-900">
                ${servicesSubtotal.toFixed(2)}
              </p>
            </div>
          </div>
        )}

        {/* Parts Section */}
        {hasParts && (
          <div className={hasServices ? "pt-6 border-t-2 border-gray-300" : ""}>
            <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-4">
              Piezas Utilizadas
            </h4>
            <div className="space-y-3">
              {order.repairOrderParts!.map((part) => (
                <div
                  key={part.id}
                  className="flex items-start justify-between p-4 bg-blue-50 rounded-xl border border-blue-200 hover:bg-blue-100 transition-colors"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-gray-900">
                        {part.part?.name || "Pieza"}
                      </p>
                      <span className="text-lg text-slate-900 ml-3 shrink-0">
                        ${(Number(part.quantity) * Number(part.part?.unitPrice || 0)).toFixed(2)}
                      </span>
                    </div>
                    {part.part?.description && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {part.part.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="bg-white px-2 py-1 rounded-md font-medium">
                        Cantidad: {part.quantity}
                      </span>
                      <span>×</span>
                      <span className="bg-white px-2 py-1 rounded-md font-medium">
                        ${Number(part.part?.unitPrice || 0).toFixed(2)} c/u
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t-2 border-slate-200 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-700">
                Subtotal Piezas
              </p>
              <p className="text-xl  text-gray-900">${partsSubtotal.toFixed(2)}</p>
            </div>
          </div>
        )}

        {/* Total Section */}
        {finalCost > 0 && (
          <div className="pt-4 border-t-2 border-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-semibold text-gray-900 tracking-wide">
                  Costo Total
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {order.repairOrderDetails?.length || 0} servicio(s) +{" "}
                  {order.repairOrderParts?.length || 0} pieza(s)
                </p>
              </div>
              <div className="text-right">
                {loadingCost ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
                    <span className="text-sm text-gray-500">Calculando...</span>
                  </div>
                ) : (
                  <p className="text-2xl text-slate-900">
                    ${finalCost.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!hasServices && !hasParts && !finalCost && (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-600 font-semibold mb-1">
              No hay costos asignados
            </p>
            <p className="text-xs text-gray-500">
              El técnico aún no ha evaluado la orden
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
