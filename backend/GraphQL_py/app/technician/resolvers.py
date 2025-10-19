from typing import List
import strawberry

# 🔹 Tipo GraphQL Technician
@strawberry.type
class Technician:
    id: str
    name: str
    lastname: str
    email: str
    phone: str
    address: str
    role: str
    specialty: str         # Ejemplo: "Hardware", "Software", "Celulares"
    experienceYears: int
    active: bool
    created_at: str
    updated_at: str


# 🔹 Resolver: lista de técnicos (datos simulados de reparación tecnológica)
def get_technicians() -> List[Technician]:
    return [
        Technician(
            id="1",
            name="Andrés",
            lastname="García",
            email="andres@mail.com",
            phone="0991112233",
            address="Manta",
            role="TECHNICIAN",
            specialty="Reparación de laptops y PCs",
            experienceYears=5,
            active=True,
            created_at="2025-10-18",
            updated_at="2025-10-18",
        ),
        Technician(
            id="2",
            name="Paola",
            lastname="Reyes",
            email="paola@mail.com",
            phone="0982223344",
            address="Portoviejo",
            role="TECHNICIAN",
            specialty="Reparación de celulares y tablets",
            experienceYears=3,
            active=True,
            created_at="2025-10-18",
            updated_at="2025-10-18",
        ),
        Technician(
            id="3",
            name="Carlos",
            lastname="Loor",
            email="carlos@mail.com",
            phone="0973334455",
            address="Chone",
            role="TECHNICIAN",
            specialty="Soporte de software y mantenimiento preventivo",
            experienceYears=7,
            active=False,
            created_at="2025-10-18",
            updated_at="2025-10-18",
        ),
        Technician(
            id="4",
            name="Daniela",
            lastname="Mendoza",
            email="daniela@mail.com",
            phone="0965556677",
            address="Montecristi",
            role="TECHNICIAN",
            specialty="Instalación de redes y reparación de impresoras",
            experienceYears=4,
            active=True,
            created_at="2025-10-18",
            updated_at="2025-10-18",
        ),
    ]
