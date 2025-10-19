import strawberry
from typing import List, Optional, TypedDict

# 🔹 Definimos un tipo de ayuda (no importa en GraphQL, solo en Python)
@strawberry.type
class User:
    id: str
    name: str
    lastname: str
    email: str
    phone: str
    address: str
    role: str
    created_at: str
    updated_at: str



def get_users() -> List[User]:
    return[
        User(
            id="1",
            name="Mario",
            lastname="Delgado",
            email="mario@mail.com",
            phone="0999999999",
            address="Manta",
            role="USER",
            created_at="2025-10-18",
            updated_at="2025-10-18",
        ),
        User(
            id="2",
            name="Gabriel",
            lastname="Arcentales",
            email="gabriel@mail.com",
            phone="0988888888",
            address="Portoviejo",
            role="TECHNICIAN",
            created_at="2025-10-18",
            updated_at="2025-10-18",
        ),
        User(
            id="3",
            name="Ana",
            lastname="Lopez",
            email="ana@mail.com",
            phone="0977777777",
            address="Quito",
            role="ADMIN",
            created_at="2025-10-18",
            updated_at="2025-10-18",
        )
    ]

