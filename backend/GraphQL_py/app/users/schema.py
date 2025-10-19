import strawberry
from typing import List
from app.users.resolvers import User,get_users




# 🔹 Consultas disponibles (solo lectura)
@strawberry.type
class UsersQuery:
    users: List[User] = strawberry.field(resolver=get_users)
