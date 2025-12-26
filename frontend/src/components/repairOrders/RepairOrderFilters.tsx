import type { Dispatch, SetStateAction } from "react";
import { OrderRepairStatus, type RepairOrder } from "../../types/repair-order.types";
import { FilterType } from "../../hooks/useRepairOrders";

interface OrdersFilterProps {
  filter: FilterType;
  setFilter: Dispatch<SetStateAction<FilterType>>;
  orders: RepairOrder[];
}

export const RepairOrderFilters = ({ filter, setFilter, orders }: OrdersFilterProps) => {
  const filters = [
    {
      key: FilterType.ALL,
      label: "Todas",
      count: orders.length,
      isActive: filter === FilterType.ALL,
    },
    {
      key: FilterType.ACTIVE,
      label: "Activas",
      count: orders.filter(
        (o) =>
          o.status !== OrderRepairStatus.DELIVERED &&
          o.status !== OrderRepairStatus.REJECTED
      ).length,
      isActive: filter === FilterType.ACTIVE,
    },
    {
      key: FilterType.COMPLETED,
      label: "Finalizadas",
      count: orders.filter(
        (o) =>
          o.status === OrderRepairStatus.DELIVERED ||
          o.status === OrderRepairStatus.REJECTED
      ).length,
      isActive: filter === FilterType.COMPLETED,
    },
  ];

  return (
    <div className="flex gap-3 mb-8">
      {filters.map(({ key, label, count, isActive }) => (
        <button
          key={key}
          onClick={() => setFilter(key)}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            isActive
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white border border-gray-300 text-gray-700 hover:border-gray-400"
          }`}
        >
          {label} <span className="ml-2 opacity-70">({count})</span>
        </button>
      ))}
    </div>
  );
};
