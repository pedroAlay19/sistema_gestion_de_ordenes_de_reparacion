import strawberry 
from typing import Optional, List
from datetime import datetime

@strawberry.type
class MaintenanceServiceType:
    id: strawberry.ID
    service_name: str
    description: str
    base_price: float
    estimated_time_minutes: int
    requires_parts: bool
    type: str
    active: bool

@strawberry.type
class SparePartType:
    id: strawberry.ID
    name: str
    description: str
    stock: int
    unit_price: float
    created_at: str
    updated_at: str

@strawberry.type
class TechnicianType:
    id: strawberry.ID
    name: str
    specialty: str
    ticket_services: Optional[List["RepairOrderDetailType"]] = None

@strawberry.type
class RepairOrderPartType:
    id: strawberry.ID
    part: SparePartType
    quantity: int
    sub_total: float
    notes: str
    created_at: str
    
@strawberry.type
class RepairOrderDetailType:
    id: strawberry.ID
    service: Optional[MaintenanceServiceType] = None
    technician: Optional[TechnicianType] = None
    unit_price: float
    discount: float
    sub_total: float
    status: str
    created_at: str
    updated_at: str

@strawberry.type
class RepairOrderType:
    id: strawberry.ID
    problem_description: str
    estimated_cost: float
    final_cost: float
    warranty_start_date: Optional[str] = None
    warranty_end_date: Optional[str] = None
    status: str
    repair_order_details: Optional[List["RepairOrderDetailType"]] = None
    repair_order_parts: Optional[List["RepairOrderPartType"]] = None
    created_at: str

@strawberry.type
class OrderStatusType:
    status: str
    count: int
    totalEstimatedCost: float
    totalFinalCost: float