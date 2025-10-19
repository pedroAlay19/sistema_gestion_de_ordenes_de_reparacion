import strawberry
from app.repair_order.resolvers import RepairOrder, get_repair_orders
from typing import List

@strawberry.type
class RepairOrderQuery:
    repair_orders: List[RepairOrder] = strawberry.field(resolver=get_repair_orders)
