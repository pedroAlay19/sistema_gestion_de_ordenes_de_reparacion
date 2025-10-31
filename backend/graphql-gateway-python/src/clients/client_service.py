import os
import requests
from dotenv import load_dotenv

from graphql_types.graphql_types import (
    RepairOrderType,
    RepairOrderDetailType
)

load_dotenv()
API_URL = os.getenv("NEST_API_URL")


def get_client_orders(client_id: str, status: str):
    """
    Obtain all repair orders for a client.
    """
    res = requests.get(f"{API_URL}/users")
    res.raise_for_status()
    users = res.json()
    repair_orders = []
    for user in users:
        if user.get("id") != client_id:
            continue
        for equipment in user.get("equipments", []):
            for order in equipment.get("repairOrders", []):
                if order.get("status") != status:
                    continue
                details = []
                for detail in order.get("repairOrderDetails", []):
                    d = RepairOrderDetailType(
                        id=detail.get("id"),
                        unit_price=float(detail.get("unitPrice", 0) or 0),
                        discount=float(detail.get("discount", 0) or 0),
                        sub_total=float(detail.get("subTotal", 0) or 0),
                        status=detail.get("status", ""),
                        created_at=detail.get("createdAt"),
                        updated_at=detail.get("updatedAt"),
                    )
                    details.append(d)
                order_obj = RepairOrderType(
                    id=order.get("id"),
                    problem_description=order.get("problemDescription", ""),
                    estimated_cost=float(order.get("estimatedCost", 0) or 0),
                    final_cost=float(order.get("finalCost", 0) or 0),
                    warranty_start_date=order.get("warrantyStartDate"),
                    warranty_end_date=order.get("warrantyEndDate"),
                    status=order.get("status", ""),
                    repair_order_details=details,
                    repair_order_parts=[],
                    created_at=order.get("createdAt"),
                )

                repair_orders.append(order_obj)

    return repair_orders