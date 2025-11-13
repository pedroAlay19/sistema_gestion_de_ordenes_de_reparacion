import { useState } from "react";
import { CubeIcon, ClockIcon, PlayIcon } from "@heroicons/react/24/outline";
import { repairOrders } from "../../../api";
import { OrderRepairStatus } from "../../../types";
import type { RepairOrder } from "../../../types";

interface WaitingPartsInfoProps {
  order: RepairOrder;
  onUpdate: (updatedOrder: RepairOrder) => void;
}

export function WaitingPartsInfo({ order, onUpdate }: WaitingPartsInfoProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResumeRepair = async () => {
    if (!window.confirm("¿Reanudar la reparación de esta orden?")) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const updatedOrder = await repairOrders.update(order.id, {
        status: OrderRepairStatus.IN_REPAIR,
      });
      onUpdate(updatedOrder);
    } catch (err) {
      console.error("Error actualizando estado:", err);
      setError("Error al reanudar la reparación. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-white rounded-2xl border border-yellow-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
          <ClockIcon className="w-6 h-6 text-yellow-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Esperando Repuestos</h3>
          <p className="text-sm text-gray-600">Esta orden está en espera de piezas</p>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-yellow-800 mb-3">
          ⏳ La reparación está pausada temporalmente mientras se reciben los repuestos necesarios.
        </p>
      </div>

      {/* Lista de piezas solicitadas */}
      {order.repairOrderParts && order.repairOrderParts.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <CubeIcon className="w-4 h-4" />
            Piezas Solicitadas
          </h4>
          <div className="space-y-2">
            {order.repairOrderParts.map((part, index) => (
              <div key={part.id || index} className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{part.part.name}</p>
                  <p className="text-sm text-gray-600">{part.part.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Cantidad: {part.quantity}</p>
                  <p className="font-semibold text-gray-900">
                    ${part.subTotal.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(!order.repairOrderParts || order.repairOrderParts.length === 0) && (
        <div className="text-center py-6">
          <CubeIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">No hay piezas registradas</p>
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Botón para reanudar reparación */}
      <div className="mt-6">
        <button
          onClick={handleResumeRepair}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Actualizando...
            </>
          ) : (
            <>
              <PlayIcon className="w-5 h-5" />
              Reanudar Reparación
            </>
          )}
        </button>
      </div>
    </div>
  );
}
