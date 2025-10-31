import strawberry
from typing import List
from graphql_types.graphql_types import OrderStatusType
from dashboard_queries.dashboard_queries_service import get_order_statistics


@strawberry.type
class DashboardQueries:

    @strawberry.field
    def repair_orders_summary(self) -> List[OrderStatusType]:
        """Obtains the count and totals of orders grouped by state"""
        return get_order_statistics()