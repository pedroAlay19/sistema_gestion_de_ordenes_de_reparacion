import strawberry
from clients.client_resolvers import  ClientsQueries
from technicians_queries.technicians_queries_resolvers import TechniciansQueries
from dashboard_queries.dashboard_queries_resolvers import DashboardQueries

@strawberry.type
class Query(ClientsQueries, TechniciansQueries, DashboardQueries):
    pass


schema = strawberry.Schema(query=Query)
