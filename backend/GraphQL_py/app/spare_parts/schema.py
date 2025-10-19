import strawberry
from typing import List
from app.spare_parts.resolvers import SparePart, get_spare_parts


@strawberry.type
class SparePartsQuery:
    spare_parts: List[SparePart] = strawberry.field(resolver=get_spare_parts)
