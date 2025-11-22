import strawberry
from typing import Optional, List


@strawberry.type
class MaintenanceServiceType:
	id: Optional[str]
	service_name: Optional[str]
	description: Optional[str]
	base_price: Optional[float]
	estimated_time_minutes: Optional[int]
	requires_parts: Optional[bool]
	type: Optional[str]
	active: Optional[bool]


@strawberry.type
class RepairOrderDetailType:
	id: Optional[str]
	unit_price: Optional[float]
	discount: Optional[float]
	sub_total: Optional[float]
	status: Optional[str]
	created_at: Optional[str]
	updated_at: Optional[str]


@strawberry.type
class UserType:
	id: Optional[str]
	name: Optional[str]
	lastName: Optional[str]
	email: Optional[str]
	phone: Optional[str]
	address: Optional[str]
	role: Optional[str]
	createdAt: Optional[str]
	updatedAt: Optional[str]

@strawberry.type
class TechnicianType(UserType):
	specialty: Optional[str]
	experienceYears: Optional[int]
	isEvaluator: Optional[bool]
	active: Optional[bool]



@strawberry.type
class SparePartType:
	id: Optional[str]
	name: Optional[str]
	price: Optional[float]
	stock: Optional[int]


@strawberry.type
class RepairOrderType:
	id: Optional[str]
	details: Optional[List[RepairOrderDetailType]]
	total: Optional[float]
	status: Optional[str]




@strawberry.type
class OrdersOverviewType:
	total: Optional[int]
	active: Optional[int]


@strawberry.type
class UsersOverviewType:
	total_clients: Optional[int]
	total_technicians: Optional[int]



@strawberry.type
class RepairOrderFullType:
    id: Optional[str]
    status: Optional[str]
    finalCost: Optional[float]
    createdAt: Optional[str]

    # Cliente
    clientName: Optional[str]
    clientLastName: Optional[str]

    # Técnico evaluador
    technicianName: Optional[str]
    technicianLastName: Optional[str]

    # Equipo
    equipmentName: Optional[str]
    equipmentType: Optional[str]



@strawberry.type
class TechnicianPerformanceType:
    technicianName: Optional[str]
    technicianLastName: Optional[str]
    totalOrders: int
    totalRevenue: float


@strawberry.type
class EquipmentType:
    id: Optional[str]
    name: Optional[str]
    type: Optional[str]
    brand: Optional[str]
    model: Optional[str]
    serialNumber: Optional[str]
    currentStatus: Optional[str]
    createdAt: Optional[str]


	# usuario dueño
    userName: Optional[str]
    userLastName: Optional[str]




