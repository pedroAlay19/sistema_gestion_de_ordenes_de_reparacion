import { useState } from "react";
import { 
  DocumentTextIcon, 
  CurrencyDollarIcon,
  PaperAirplaneIcon 
} from "@heroicons/react/24/outline";
import { repairOrders } from "../../../api";
import { OrderRepairStatus } from "../../../types";
import type { RepairOrder } from "../../../types";

interface InReviewActionsProps {
  order: RepairOrder;
  onUpdate: (updatedOrder: RepairOrder) => void;
}

export function InReviewActions({ order, onUpdate }: InReviewActionsProps) {
  const [diagnosis, setDiagnosis] = useState(order.diagnosis || "");
  const [estimatedCost, setEstimatedCost] = useState(order.estimatedCost?.toString() || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!diagnosis.trim()) {
      setError("El diagnóstico es obligatorio");
      return;
    }

    if (!estimatedCost || parseFloat(estimatedCost) <= 0) {
      setError("Debe ingresar un costo estimado válido");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const updatedOrder = await repairOrders.update(order.id, {
        diagnosis: diagnosis.trim(),
        estimatedCost: parseFloat(estimatedCost),
        status: OrderRepairStatus.WAITING_APPROVAL,
      });
      onUpdate(updatedOrder);
    } catch (err) {
      console.error("Error al enviar diagnóstico:", err);
      setError("Error al enviar el diagnóstico. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <DocumentTextIcon className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Revisión Técnica</h3>
          <p className="text-sm text-gray-600">Complete el diagnóstico y envíe para aprobación</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {/* Diagnóstico */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Diagnóstico Técnico *
          </label>
          <textarea
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            placeholder="Describa el problema encontrado y la solución propuesta..."
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Costo Estimado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Costo Estimado *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <CurrencyDollarIcon className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="number"
              step="0.01"
              min="0"
              value={estimatedCost}
              onChange={(e) => setEstimatedCost(e.target.value)}
              placeholder="0.00"
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Este costo será enviado al cliente para su aprobación
          </p>
        </div>

        {/* Botón de envío */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <PaperAirplaneIcon className="w-5 h-5" />
              Enviar para Aprobación
            </>
          )}
        </button>
      </div>
    </div>
  );
}
