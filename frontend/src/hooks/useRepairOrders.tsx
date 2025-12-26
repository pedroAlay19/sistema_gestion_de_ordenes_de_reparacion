import { useEffect, useState } from "react";
import { repairOrders } from "../api";
import { OrderRepairStatus } from "../types/repair-order.types";
import type { RepairOrder } from "../types/repair-order.types";

export enum FilterType {
  ALL = "all",
  ACTIVE = "active",
  COMPLETED = "completed",
}

export const useRepairOrders = () => {
  const [orders, setOrders] = useState<RepairOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>(FilterType.ALL);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        const data = await repairOrders.getAll();
        setOrders(data);
      } catch (err) {
        console.error("Error cargando órdenes:", err);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (filter === "active")
      return (
        order.status !== OrderRepairStatus.DELIVERED &&
        order.status !== OrderRepairStatus.REJECTED
      );
    if (filter === "completed")
      return (
        order.status === OrderRepairStatus.DELIVERED ||
        order.status === OrderRepairStatus.REJECTED
      );
    return true;
  });

  return { orders, filteredOrders, loading, filter, setFilter };
};
