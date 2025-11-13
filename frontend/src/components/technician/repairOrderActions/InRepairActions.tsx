import { useState } from "react";
import { ClockIcon, TrashIcon, WrenchScrewdriverIcon, CubeIcon } from "@heroicons/react/24/outline";
import { repairOrders } from "../../../api";
import { OrderRepairStatus } from "../../../types";
import type { RepairOrder } from "../../../types";
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
      const updatedOrder = await repairOrders.update(order.id, {
        details: details.length > 0 ? details : undefined,
        parts: parts.length > 0 ? parts : undefined,
      });
      onUpdate(updatedOrder);
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
      // Filtrar el detalle eliminado
      const remainingDetails = order.repairOrderDetails?.filter(d => d.id !== detailId) || [];
      
      const updatedOrder = await repairOrders.update(order.id, {
        details: remainingDetails.map(d => ({
          id: d.id,
          serviceId: d.service.id,
          technicianId: d.technician.id,
          unitPrice: d.unitPrice,
          discount: d.discount || 0,
          notes: d.notes || "",
        })),
      });
      onUpdate(updatedOrder);
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
      // Filtrar la pieza eliminada
      const remainingParts = order.repairOrderParts?.filter(p => p.id !== partId) || [];
      
      const updatedOrder = await repairOrders.update(order.id, {
        parts: remainingParts.map(p => ({
          id: p.id,
          partId: p.part.id,
          quantity: p.quantity,
          imgUrl: p.imgUrl || "",
        })),
      });
      onUpdate(updatedOrder);
    } catch (err) {
      console.error("Error eliminando pieza:", err);
      setError("Error al eliminar la pieza. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsWaitingParts = async () => {
    if (!window.confirm("¿Marcar esta orden como esperando repuestos?")) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const updatedOrder = await repairOrders.update(order.id, {
        status: OrderRepairStatus.WAITING_PARTS,
      });
      onUpdate(updatedOrder);
    } catch (err) {
      console.error("Error actualizando estado:", err);
      setError("Error al actualizar el estado. Intente nuevamente.");
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
                        Precio: <span className="font-bold text-blue-600">${detail.unitPrice}</span>
                      </span>
                      {detail.discount && detail.discount > 0 && (
                        <span className="text-green-600">
                          Descuento: ${detail.discount}
                        </span>
                      )}
                      <span className="text-gray-700">
                        Subtotal: <span className="font-bold text-gray-900">${detail.subTotal}</span>
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
                        Subtotal: <span className="font-bold text-gray-900">${part.subTotal}</span>
                      </span>
                    </div>
                    {part.imgUrl && (
                      <div className="mt-2">
                        <img 
                          src={part.imgUrl} 
                          alt={part.part.name}
                          className="w-20 h-20 object-cover rounded-lg border border-purple-300"
                        />
                      </div>
                    )}
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
      <AssignDetailsForm onSave={handleSaveDetails} />

      {/* Botón destacado para marcar como esperando repuestos */}
      <div className="bg-linear-to-r from-orange-50 to-yellow-50 rounded-2xl border-2 border-orange-300 p-6 shadow-lg">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
            <ClockIcon className="w-7 h-7 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              ¿Necesita repuestos para continuar?
            </h3>
            <p className="text-sm text-gray-600">
              Si requiere piezas adicionales para completar la reparación, puede pausar temporalmente esta orden.
            </p>
          </div>
        </div>
        <button
          onClick={handleMarkAsWaitingParts}
          disabled={loading}
          className="w-full bg-linear-to-r from-orange-600 to-orange-500 text-white py-4 px-6 rounded-xl font-semibold hover:from-orange-700 hover:to-orange-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-3 text-base"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Actualizando estado...
            </>
          ) : (
            <>
              <ClockIcon className="w-6 h-6" />
              Marcar como: Esperando Repuestos
            </>
          )}
        </button>
      </div>
    </div>
  );
}
