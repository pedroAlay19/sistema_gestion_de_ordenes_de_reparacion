import os
import requests
from dotenv import load_dotenv
from graphql_types.graphql_types import OrderStatusType

load_dotenv()
API_URL = os.getenv("NEST_API_URL")

def get_order_statistics():
    """
    Obtains the count and totals of orders grouped by state
    """
    res = requests.get(f"{API_URL}/repair-orders")
    res.raise_for_status()
    repair_orders = res.json()

    status_groups = {}
    for order in repair_orders:
        status = order.get("status")
        estimated_cost = float(order.get("estimatedCost", 0) or 0)
        final_cost = float(order.get("finalCost", 0) or 0)

        if status not in status_groups:
            status_groups[status] = {
                "status": status,
                "count": 0,
                "totalEstimatedCost": 0.0,
                "totalFinalCost": 0.0
            }

        status_groups[status]["count"] += 1
        status_groups[status]["totalEstimatedCost"] += estimated_cost
        status_groups[status]["totalFinalCost"] += final_cost
        
    result = []
    for v in status_groups.values():
        item = OrderStatusType(
            status=v.get("status"),
            count=v.get("count", 0),
            totalEstimatedCost=v.get("totalEstimatedCost", 0.0),
            totalFinalCost=v.get("totalFinalCost", 0.0),
        )
        result.append(item)

    return result