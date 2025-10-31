import strawberry
from typing import List
from graphql_types.graphql_types import RepairOrderType
from clients.client_service import get_client_orders


@strawberry.type
class ClientsQueries:

    @strawberry.field
    def repair_orders(self, client_id: str, status: str) -> List[RepairOrderType]:
        """Lista todas las órdenes de reparación."""
        return get_client_orders(client_id, status)