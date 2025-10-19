from typing import List
import strawberry

# 🔹 Tipo GraphQL para piezas de repuesto tecnológicas
@strawberry.type
class SparePart:
    id: str
    name: str
    description: str
    stock: int
    unitPrice: float
    created_at: str
    updated_at: str


# 🔹 Resolver con datos simulados (contexto: reparación de laptops, PCs y celulares)
def get_spare_parts() -> List[SparePart]:
    return [
        SparePart(
            id="1",
            name="Pantalla LCD 15.6”",
            description="Pantalla LED para laptops HP, Dell y Lenovo. Resolución 1366x768 HD.",
            stock=12,
            unitPrice=95.50,
            created_at="2025-10-18",
            updated_at="2025-10-18",
        ),
        SparePart(
            id="2",
            name="Batería para laptop ASUS X512",
            description="Batería de iones de litio de 11.1V compatible con modelos VivoBook.",
            stock=8,
            unitPrice=68.90,
            created_at="2025-10-18",
            updated_at="2025-10-18",
        ),
        SparePart(
            id="3",
            name="Cargador USB-C 65W",
            description="Cargador universal tipo C para laptops modernos y celulares de alta gama.",
            stock=25,
            unitPrice=35.00,
            created_at="2025-10-18",
            updated_at="2025-10-18",
        ),
        SparePart(
            id="4",
            name="Disco SSD 500GB Kingston",
            description="Unidad de estado sólido para mejorar el rendimiento de PCs y laptops.",
            stock=15,
            unitPrice=48.99,
            created_at="2025-10-18",
            updated_at="2025-10-18",
        ),
        SparePart(
            id="5",
            name="Pantalla táctil Samsung A30",
            description="Repuesto original para teléfono Samsung Galaxy A30/A30s.",
            stock=10,
            unitPrice=42.75,
            created_at="2025-10-18",
            updated_at="2025-10-18",
        ),
    ]
