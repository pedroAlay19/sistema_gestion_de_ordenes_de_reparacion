import strawberry
from typing import List
from graphql_types.graphql_types import RepairOrderDetailType
from technicians_queries.technicians_queries_service import get_technician_orders 


@strawberry.type
class TechniciansQueries:

    @strawberry.field
    def assigned_repair_orders(self, technician_id: str, status: str) -> List[RepairOrderDetailType]:
        """Repairs assigned to a technician"""
        return get_technician_orders(technician_id, status)