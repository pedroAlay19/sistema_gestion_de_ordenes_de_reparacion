import strawberry
from app.repair_order_detail.resolvers import RepairOrderDetail, get_repair_order_details


@strawberry.type
class RepairOrderDetailQuery:
    repair_order_details = strawberry.field(resolver=get_repair_order_details)
