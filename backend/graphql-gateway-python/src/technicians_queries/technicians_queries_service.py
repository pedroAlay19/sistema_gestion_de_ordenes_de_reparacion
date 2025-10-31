import os
import requests
from dotenv import load_dotenv

from graphql_types.graphql_types import (
    RepairOrderDetailType,
    MaintenanceServiceType
)

load_dotenv()
API_URL = os.getenv("NEST_API_URL")

def get_technician_orders(technician_id: str, status: str):
    """
    Obtain all repair orders assigned to a technician.
    """
    res = requests.get(f"{API_URL}/users/technician")
    res.raise_for_status()
    technicians = res.json()

    repair_orders = []
    for technician in technicians:
        if technician.get("id") != technician_id:
            continue
        for detail in technician.get("ticketServices", []):
            if detail.get("status") != status:
                continue
            service = detail.get("service")
            s = MaintenanceServiceType(
                id=service.get("id"),
                service_name=service.get("serviceName", ""),
                description=service.get("description", ""),
                base_price=float(service.get("basePrice", 0) or 0),
                estimated_time_minutes=service.get("estimatedTimeMinutes", 0),
                requires_parts=service.get("requiresParts", False),
                type=service.get("type", ""),
                active=service.get("active", False),
            )
            d = RepairOrderDetailType(
                id=detail.get("id"),
                service=s,
                unit_price=float(detail.get("unitPrice", 0) or 0),
                discount=float(detail.get("discount", 0) or 0),
                sub_total=float(detail.get("subTotal", 0) or 0),
                status=detail.get("status", ""),
                created_at=detail.get("createdAt"),
                updated_at=detail.get("updatedAt"),
            )
            repair_orders.append(d)

    return repair_orders