import os
from typing import Dict, Any, List, Optional
import requests
from dotenv import load_dotenv

from .admin_types import (
	UserType,
	SparePartType,
	MaintenanceServiceType,
	RepairOrderType,
	RepairOrderDetailType,
	TechnicianType
)

load_dotenv()
API_URL = os.getenv("NEST_API_URL")


def _build_headers(auth_header: Optional[str] = None, extra: Optional[Dict[str, str]] = None) -> Dict[str, str]:
    headers: Dict[str, str] = {}

    # Siempre agregar "Bearer " si no está presente
    if auth_header:
        if not auth_header.startswith("Bearer "):
            auth_header = f"Bearer {auth_header}"
        headers["Authorization"] = auth_header

    if extra:
        headers.update(extra)

    return headers


def get_users(auth_header: Optional[str] = None) -> List[UserType]:
	res = requests.get(f"{API_URL}/users", headers=_build_headers(auth_header), timeout=10)
	res.raise_for_status()
	users = res.json() or []
	out: List[UserType] = []
	for u in users:
		out.append(
			UserType(
				id=u.get("id"),
				name=u.get("name"),
				lastName=u.get("lastName"),
				email=u.get("email"),
				phone=u.get("phone"),
				address=u.get("address"),
				role=u.get("role"),
				createdAt=u.get("createdAt"),
                updatedAt=u.get("updatedAt")
			)
		)
	return out


def get_user(user_id: str, auth_header: Optional[str] = None) -> Optional[UserType]:
	res = requests.get(f"{API_URL}/users/{user_id}", headers=_build_headers(auth_header), timeout=10)
	res.raise_for_status()
	u = res.json() or {}
	return UserType(
    id=u.get("id"),
    name=u.get("name"),
    lastName=u.get("lastName"),
    email=u.get("email"),
    phone=u.get("phone"),
    address=u.get("address"),
    role=u.get("role"),
    createdAt=u.get("createdAt"),
)


def get_technician(user_id: str, auth_header: Optional[str] = None) -> Optional[TechnicianType]:
    res = requests.get(f"{API_URL}/users/{user_id}", headers=_build_headers(auth_header), timeout=10)
    res.raise_for_status()
    u = res.json()
    return TechnicianType(
        id=u.get("id"),
        name=u.get("name"),
        lastName=u.get("lastName"),
        email=u.get("email"),
        phone=u.get("phone"),
        address=u.get("address"),
        role=u.get("role"),
        createdAt=u.get("createdAt"),
        updatedAt=u.get("updatedAt"),
        specialty=u.get("specialty"),
        experienceYears=u.get("experienceYears"),
        isEvaluator=u.get("isEvaluator"),
        active=u.get("active"),
    )


def get_users_raw(auth_header: Optional[str] = None) -> list:
    """
    Devuelve el JSON completo del REST sin convertir a UserType.
    Ideal para reportes PDF.
    """
    res = requests.get(f"{API_URL}/users", headers=_build_headers(auth_header), timeout=10)
    res.raise_for_status()
    return res.json() or []


def get_technicians_raw(auth_header: Optional[str] = None) -> list:
    res = requests.get(
        f"{API_URL}/users/technician",
        headers=_build_headers(auth_header),
        timeout=10
    )
    res.raise_for_status()
    return res.json() or []

def get_technician_raw(user_id: str, auth_header=None) -> dict:
    res = requests.get(
        f"{API_URL}/users/{user_id}",
        headers=_build_headers(auth_header),
        timeout=10
    )
    res.raise_for_status()
    return res.json() or {}

def get_equipments_raw(auth_header: Optional[str] = None) -> list:
    res = requests.get(
        f"{API_URL}/equipments",
        headers=_build_headers(auth_header),
        timeout=10
    )
    res.raise_for_status()
    return res.json() or []


def get_equipment(auth_header: Optional[str], id: str):
    res = requests.get(
        f"{API_URL}/equipments/{id}",
        headers=_build_headers(auth_header),
        timeout=10
    )
    res.raise_for_status()
    return res.json() or {}

def get_equipment(equipment_id: str, auth_header: Optional[str] = None):
    res = requests.get(
        f"{API_URL}/equipments/{equipment_id}",
        headers=_build_headers(auth_header),
        timeout=10
    )
    res.raise_for_status()
    return res.json() or {}


def get_equipment_raw(equipment_id: str, auth_header: Optional[str] = None) -> dict:
    res = requests.get(
        f"{API_URL}/equipments/{equipment_id}",
        headers=_build_headers(auth_header),
        timeout=10
    )
    res.raise_for_status()
    return res.json() or {}



# Spare parts
def get_spare_parts(auth_header: Optional[str] = None) -> List[SparePartType]:
	res = requests.get(f"{API_URL}/spare-parts", headers=_build_headers(auth_header), timeout=10)
	res.raise_for_status()
	items = res.json() or []
	out: List[SparePartType] = []
	for p in items:
		out.append(SparePartType(id=p.get("id"), name=p.get("name"), price=float(p.get("price", 0) or 0), stock=p.get("stock")))
	return out


# Services (maintenance)
def get_services(auth_header: Optional[str] = None) -> List[MaintenanceServiceType]:
	res = requests.get(f"{API_URL}/services", headers=_build_headers(auth_header), timeout=10)
	res.raise_for_status()
	items = res.json() or []
	out: List[MaintenanceServiceType] = []
	for s in items:
		out.append(MaintenanceServiceType(
			id=s.get("id"),
			service_name=s.get("serviceName"),
			description=s.get("description"),
			base_price=float(s.get("basePrice", 0) or 0),
			estimated_time_minutes=s.get("estimatedTimeMinutes"),
			requires_parts=s.get("requiresParts", False),
			type=s.get("type"),
			active=s.get("active", False),
		))
	return out


# Repair orders and stats
def get_repair_orders(auth_header: Optional[str] = None) -> List[RepairOrderType]:
    res = requests.get(f"{API_URL}/repair-orders", headers=_build_headers(auth_header), timeout=10)
    res.raise_for_status()
    items = res.json() or []
    out: List[RepairOrderType] = []

    for r in items:
        details_json = (
            r.get("details")
            or r.get("ticketServices")
            or r.get("repairOrderDetails")
            or []
        )

        details: List[RepairOrderDetailType] = []
        for d in details_json:
            details.append(
                RepairOrderDetailType(
                    id=d.get("id"),
                    unit_price=float(d.get("unitPrice", 0) or 0),
                    discount=float(d.get("discount", 0) or 0),
                    sub_total=float(d.get("subTotal", 0) or 0),
                    status=d.get("status"),
                    created_at=d.get("createdAt"),
                    updated_at=d.get("updatedAt"),
                )
            )

        out.append(
            RepairOrderType(
                id=r.get("id"),
                details=details,
                total=float(r.get("total", 0) or 0),
                status=r.get("status"),
            )
        )

    return out


def get_repair_orders_raw(auth_header: Optional[str] = None) -> list:
    """
    Necesario para reportes de órdenes por estado.
    """
    res = requests.get(
        f"{API_URL}/repair-orders",
        headers=_build_headers(auth_header),
        timeout=10
    )
    res.raise_for_status()
    return res.json() or []



def get_repair_order_raw(order_id: str, auth_header: Optional[str] = None) -> dict:
    res = requests.get(
        f"{API_URL}/repair-orders/{order_id}",
        headers=_build_headers(auth_header),
        timeout=10,
    )
    res.raise_for_status()
    return res.json() or {}



def get_technicians(auth_header: Optional[str] = None) -> List[TechnicianType]:
    """
    Devuelve únicamente los usuarios cuyo rol es 'Technician'
    y los mapea al tipo TechnicianType.
    """
    res = requests.get(
        f"{API_URL}/users/technician",
        headers=_build_headers(auth_header),
        timeout=10
    )
    res.raise_for_status()
    users = res.json() or []

    technicians: List[TechnicianType] = []

    for u in users:
        if u.get("role") == "Technician":
            technicians.append(
                TechnicianType(
                    id=u.get("id"),
                    name=u.get("name"),
                    lastName=u.get("lastName"),
                    email=u.get("email"),
                    phone=u.get("phone"),
                    address=u.get("address"),
                    role=u.get("role"),
                    createdAt=u.get("createdAt"),
                    updatedAt=u.get("updatedAt"),
                    specialty=u.get("specialty"),
                    experienceYears=u.get("experienceYears"),
                    isEvaluator=u.get("isEvaluator"),
                    active=u.get("active"),
                )
            )

    return technicians


def get_equipment_raw(equipment_id: str, auth_header: Optional[str] = None) -> dict:
    """
    Devuelve el JSON completo del REST para un equipo específico,
    incluyendo usuario y órdenes asociadas.
    """
    res = requests.get(
        f"{API_URL}/equipments/{equipment_id}",
        headers=_build_headers(auth_header),
        timeout=10
    )
    res.raise_for_status()
    return res.json() or {}


def get_spare_parts_raw(auth_header: Optional[str] = None) -> list:
    res = requests.get(
        f"{API_URL}/spare-parts",
        headers=_build_headers(auth_header),
        timeout=10
    )
    res.raise_for_status()
    return res.json() or []


