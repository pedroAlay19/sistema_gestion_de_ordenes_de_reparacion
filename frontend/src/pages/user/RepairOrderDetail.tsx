import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { repairOrders, reviews } from "../../api";
import type { RepairOrder } from "../../types/repair-order.types";
import type { Review } from "../../types/review.types";
import { OrderRepairStatus } from "../../types/repair-order.types";
import { RepairTimeline } from "../../components/repairOrderDetail/repairTimeline";
import { RepairOrderTopBar } from "../../components/repairOrderDetail/repairOrderTopBar";
import { RepairApprovalActions } from "../../components/repairOrderDetail/RepairApprovalActions";
import { ReviewFormToggle } from "../../components/repairOrderDetail/ReviewFormToggle";
import { SideBar } from "../../components/repairOrderDetail/Sidebar";
import { CostBreakdown } from "../../components/repairOrderDetail/CostBreakdown";

export default function RepairOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<RepairOrder | null>(null);
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await repairOrders.getById(id);
        setOrder(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const loadReview = async () => {
      try {
        const data = await reviews.findByRepairOrderId(id);
        // findByRepairOrderId retorna un array, tomamos el primero si existe
        setReview(data.length > 0 ? data[0] : null);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    loadReview();
  }, [id]);

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
          <Link to="/user/repair-orders" className="text-black hover:underline">
            Volver a mis órdenes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Top Bar */}
      <RepairOrderTopBar orderId={order.id} orderStatus={order.status} />

      <div className="p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Timeline */}
          <div className="lg:col-span-2 space-y-6">
            {/* Timeline Vertical */}
            <RepairTimeline order={order} />

            {/* Cost Breakdown */}
            <CostBreakdown order={order} />

            {/* Actions */}
            {order.status === OrderRepairStatus.WAITING_APPROVAL &&
              order.diagnosis && <RepairApprovalActions id={order.id} />}

            {/* Review Form */}
            {order.status === OrderRepairStatus.DELIVERED && (
              <ReviewFormToggle
                id={order.id}
                review={review}
                setReview={setReview}
              />
            )}
          </div>

          {/* Side Bar */}
          <SideBar order={order} showHistoryButton={false} />
        </div>
      </div>
    </>
  );
}
