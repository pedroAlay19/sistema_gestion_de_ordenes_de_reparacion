import ArrowLeftIcon from "@heroicons/react/24/outline/ArrowLeftIcon";
import type { OrderRepairStatus } from "../../types";
import { getOrderStatusText } from "../../utils";
import { getBadgeClasses } from "../ui";
import { useNavigate } from "react-router-dom";

interface RepairOrderTopBarProps {
  orderId: string;
  orderStatus: OrderRepairStatus;
  routeBack?: string;
}

export const RepairOrderTopBar: React.FC<RepairOrderTopBarProps> = ({
  orderId,
  orderStatus,
  routeBack,
}: RepairOrderTopBarProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-900 border-b border-gray-800 px-8 py-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(routeBack || "/user/repair-orders")}
          className="flex items-center gap-2 text-gray-200 hover:text-gray-400 transition-colors mb-4"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Volver a ordenes
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-500 mb-1">
              Orden {orderId.toString().padStart(5, "0")}
            </h1>
          </div>
          <span
            className={
              getBadgeClasses(orderStatus) +
              "px-4 py-2 rounded-xl font-semibold"
            }
          >
            {getOrderStatusText(orderStatus)}
          </span>
        </div>
      </div>
    </div>
  );
};
