import strawberry
from admin_queries.admin_resolvers import AdminQueries
class Query(AdminQueries):
    pass


schema = strawberry.Schema(query=Query)