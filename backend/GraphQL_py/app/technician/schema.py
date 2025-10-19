import strawberry
from typing import List
from app.technician.resolvers import Technician, get_technicians


@strawberry.type
class TechnicianQuery:
    technicians: List[Technician] = strawberry.field(resolver=get_technicians)
