import strawberry

from app.users.schema import UsersQuery
from app.technician.schema import TechnicianQuery
from app.spare_parts.schema import SparePartsQuery
from app.repair_order.schema import RepairOrderQuery
from app.repair_order_review.schema import RepairOrderReviewQuery
from app.repair_order_part.schema import RepairOrderPartQuery
from app.repair_order_notification.schema import RepairOrderNotificationQuery
from app.repair_order_detail.schema import RepairOrderDetailQuery
from app.maintenace_services.schema import ServiceMaintenanceQuery
from app.equipments.schema import EquipmentQuery


@strawberry.type
class Query(UsersQuery, TechnicianQuery, SparePartsQuery, RepairOrderQuery, RepairOrderReviewQuery,
            RepairOrderPartQuery, RepairOrderNotificationQuery,RepairOrderDetailQuery,
            ServiceMaintenanceQuery,EquipmentQuery):
    pass



schema = strawberry.Schema(query=Query)
