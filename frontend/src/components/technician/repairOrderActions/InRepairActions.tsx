import { useState } from "react";
import { TrashIcon, WrenchScrewdriverIcon, CubeIcon } from "@heroicons/react/24/outline";
import { repairOrders } from "../../../api";
import type { RepairOrder } from "../../../types/repair-order.types";
import type { 
  CreateRepairOrderDetailDto,
  CreateRepairOrderPartDto 
} from "../../../api";
import { AssignDetailsForm } from "./AssignDetailsForm";

interface InRepairActionsProps {
  order: RepairOrder;
  onUpdate: (updatedOrder: RepairOrder) => void;
}

export function InRepairActions({ order, onUpdate }: InRepairActionsProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSaveDetails = async (details: CreateRepairOrderDetailDto[], parts: CreateRepairOrderPartDto[]) => {
    setLoading(true);
    setError(null);

    try {
      // Si la orden no tiene detalles aún, es la asignación inicial - usar assignWork
      if (!order.repairOrderDetails || order.repairOrderDetails.length === 0) {
        await repairOrders.assignWork(order.id, { details, parts });
      } else {
        // Si ya tiene detalles, agregar individualmente
        for (const detail of details) {
          await repairOrders.addDetail(order.id, detail);
        }
        
        for (const part of parts) {
          await repairOrders.addPart(order.id, part);
        }
      }
      
      // Recargar la orden completa desde el backend para asegurar datos consistentes
      const refreshedOrder = await repairOrders.getById(order.id);
      onUpdate(refreshedOrder);
    } catch (err) {
      console.error("Error guardando detalles:", err);
      setError("Error al guardar los detalles. Intente nuevamente.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDetail = async (detailId: string) => {
    if (!window.confirm("¿Está seguro de eliminar este servicio?")) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await repairOrders.removeDetail(order.id, detailId);
      // Recargar la orden completa desde el backend para asegurar datos consistentes
      const refreshedOrder = await repairOrders.getById(order.id);
      onUpdate(refreshedOrder);
    } catch (err) {
      console.error("Error eliminando detalle:", err);
      setError("Error al eliminar el servicio. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePart = async (partId: string) => {
    if (!window.confirm("¿Está seguro de eliminar esta pieza?")) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await repairOrders.removePart(order.id, partId);
      // Recargar la orden completa desde el backend para asegurar datos consistentes
      const refreshedOrder = await repairOrders.getById(order.id);
      onUpdate(refreshedOrder);
    } catch (err) {
      console.error("Error eliminando pieza:", err);
      setError("Error al eliminar la pieza. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Tarjetas de Servicios Asignados */}
      {order.repairOrderDetails && order.repairOrderDetails.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <WrenchScrewdriverIcon className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Servicios Asignados</h3>
          </div>
          <div className="space-y-3">
            {order.repairOrderDetails.map((detail) => (
              <div
                key={detail.id}
                className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {detail.service.serviceName}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Técnico: <span className="font-medium">{detail.technician.name}</span>
                    </p>
                    {detail.notes && (
                      <p className="text-sm text-gray-700 italic mb-2">"{detail.notes}"</p>
                    )}
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-700">
                        Precio: <span className="font-bold text-blue-600">${detail.repairPrice}</span>
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteDetail(detail.id)}
                    disabled={loading}
                    className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Eliminar servicio"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tarjetas de Piezas Asignadas */}
      {order.repairOrderParts && order.repairOrderParts.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <CubeIcon className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Piezas Asignadas</h3>
          </div>
          <div className="space-y-3">
            {order.repairOrderParts.map((part) => (
              <div
                key={part.id}
                className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {part.part.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {part.part.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-700">
                        Cantidad: <span className="font-bold text-purple-600">{part.quantity}</span>
                      </span>
                      <span className="text-gray-700">
                        Precio unitario: <span className="font-medium">${part.part.unitPrice}</span>
                      </span>
                      <span className="text-gray-700">
                        Total: <span className="font-bold text-gray-900">${part.quantity * part.part.unitPrice}</span>
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeletePart(part.id)}
                    disabled={loading}
                    className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Eliminar pieza"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Formulario para agregar más servicios/piezas */}
      <AssignDetailsForm order={order} onSave={handleSaveDetails} />
    </div>
  );
}
