import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { repairOrders } from "../../api";
import type { RepairOrder } from "../../types";
import { OrderRepairStatus } from "../../types";
import { RepairTimeline } from "../../components/repairOrderDetail/repairTimeline";
import { RepairOrderTopBar } from "../../components/repairOrderDetail/repairOrderTopBar";
import { SideBar } from "../../components/repairOrderDetail/SideBar";
import {
  InReviewActions,
  InRepairActions,
  ReadyActions,
  WaitingPartsInfo,
} from "../../components/technician/repairOrderActions";

export default function TechnicianRepairOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<RepairOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await repairOrders.getById(id);
        setOrder(data);
      } catch (error) {
        console.error("Error cargando orden:", error);
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
  }, [id]);

  const handleOrderUpdate = (updatedOrder: RepairOrder) => {
    setOrder(updatedOrder);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-900 text-xl font-medium">Cargando...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Orden no encontrada
          </h2>
          <Link to="/technician/orders" className="text-blue-600 hover:underline">
            Volver a mis órdenes asignadas
          </Link>
        </div>
      </div>
    );
  }

  // Renderizar componente de acciones según el estado
  const renderActions = () => {
    switch (order.status) {
      case OrderRepairStatus.IN_REVIEW:
        return (
          <InReviewActions
            order={order}
            onUpdate={handleOrderUpdate}
          />
        );
      case OrderRepairStatus.IN_REPAIR:
        return (
          <InRepairActions
            order={order}
            onUpdate={handleOrderUpdate}
          />
        );
      case OrderRepairStatus.WAITING_PARTS:
        return (
          <WaitingPartsInfo
            order={order}
            onUpdate={handleOrderUpdate}
          />
        );
      case OrderRepairStatus.READY:
        return (
          <ReadyActions order={order} onUpdate={handleOrderUpdate} />
        );
      case OrderRepairStatus.DELIVERED:
        return (
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-green-900 mb-2">
                Orden Entregada
              </h3>
              <p className="text-sm text-green-800">
                Esta orden ha sido completada y entregada al cliente.
              </p>
            </div>
          </div>
        );
      case OrderRepairStatus.WAITING_APPROVAL:
        return (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-blue-900 mb-2">
                Esperando Aprobación del Cliente
              </h3>
              <p className="text-sm text-blue-800">
                El diagnóstico y costo estimado han sido enviados al cliente para su revisión.
              </p>
            </div>
          </div>
        );
      case OrderRepairStatus.REJECTED:
        return (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-red-900 mb-2">
                Orden Rechazada
              </h3>
              <p className="text-sm text-red-800">
                El cliente ha rechazado la cotización para esta reparación.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Top Bar */}
      <RepairOrderTopBar orderId={order.id} orderStatus={order.status} routeBack="/technician/orders"/>

      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Timeline y Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Timeline Vertical */}
            <RepairTimeline order={order} />

            {/* Actions según estado */}
            {renderActions()}
          </div>

          {/* Side Bar */}
          <SideBar order={order} />
        </div>
      </div>
    </>
  );
}
