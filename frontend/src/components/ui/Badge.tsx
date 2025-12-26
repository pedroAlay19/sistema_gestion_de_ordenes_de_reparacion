import { OrderRepairStatus } from "../../types/repair-order.types";
import { getOrderStatusBadge } from "../../utils";

export type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "secondary";

export const getBadgeClasses = (status: OrderRepairStatus): string => {
  const variant = getOrderStatusBadge(status);

  const baseClasses = "px-3 py-1 rounded-full text-xs font-medium border";

  const variantClasses: Record<string, string> = {
    info: "bg-blue-50 text-blue-700 border-blue-200",
    warning: "bg-yellow-50 text-yellow-700 border-yellow-200",
    success: "bg-green-50 text-green-700 border-green-200",
    danger: "bg-red-50 text-red-700 border-red-200",
    secondary: "bg-purple-50 text-purple-700 border-purple-200",
    default: "bg-gray-50 text-gray-700 border-gray-200",
  };

  return `${baseClasses} ${variantClasses[variant] || variantClasses.default}`;
};
