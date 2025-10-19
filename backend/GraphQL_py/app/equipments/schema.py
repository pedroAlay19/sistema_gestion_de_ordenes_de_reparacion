import strawberry
from typing import List
from app.equipments.resolvers import Equipment, get_equipments


@strawberry.type
class EquipmentQuery:
    equipments: List[Equipment] = strawberry.field(resolver=get_equipments)
