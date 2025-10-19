import strawberry
from app.repair_order_part.resolvers import RepairOrderPart, get_repair_order_parts


@strawberry.type
class RepairOrderPartQuery:
    repair_order_parts = strawberry.field(resolver=get_repair_order_parts)
