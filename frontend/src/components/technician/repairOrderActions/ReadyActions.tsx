import { useState } from "react";
import { CheckCircleIcon, TruckIcon } from "@heroicons/react/24/outline";
import { repairOrders } from "../../../api";
import { OrderRepairStatus } from "../../../types";
import type { RepairOrder } from "../../../types";

interface ReadyActionsProps {
  order: RepairOrder;
  onUpdate: (updatedOrder: RepairOrder) => void;
}

export function ReadyActions({ order, onUpdate }: ReadyActionsProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMarkAsDelivered = async () => {
    if (!window.confirm("¿Está seguro de marcar esta orden como entregada? Esta acción no se puede deshacer.")) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const updatedOrder = await repairOrders.update(order.id, {
        status: OrderRepairStatus.DELIVERED,
      });
      onUpdate(updatedOrder);
    } catch (err) {
      console.error("Error al marcar como entregado:", err);
      setError("Error al actualizar el estado. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          <CheckCircleIcon className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Orden Lista</h3>
          <p className="text-sm text-gray-600">La reparación está completa y lista para entrega</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-green-800">
          ✅ La reparación ha sido completada. Puede entregar el equipo al cliente.
        </p>
      </div>

      <button
        onClick={handleMarkAsDelivered}
        disabled={loading}
        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Actualizando...
          </>
        ) : (
          <>
            <TruckIcon className="w-5 h-5" />
            Marcar como Entregado
          </>
        )}
      </button>
    </div>
  );
}
