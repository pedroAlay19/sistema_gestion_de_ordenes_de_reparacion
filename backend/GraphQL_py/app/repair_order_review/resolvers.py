import strawberry
from typing import List

# 🔹 Tipo GraphQL para reseñas de órdenes de reparación
@strawberry.type
class RepairOrderReview:
    id: str
    repairOrderId: str
    rating: int
    comment: str
    visible: bool
    created_at: str
    updated_at: str


# 🔹 Datos simulados (ejemplos reales de reseñas de reparaciones tecnológicas)
def get_repair_order_reviews() -> List[RepairOrderReview]:
    return [
        RepairOrderReview(
            id="1",
            repairOrderId="1",
            rating=5,
            comment="Excelente servicio, mi laptop ahora funciona como nueva .",
            visible=True,
            created_at="2025-10-15",
            updated_at="2025-10-16",
        ),
        RepairOrderReview(
            id="2",
            repairOrderId="2",
            rating=4,
            comment="La reparación fue buena, pero demoró un poco más de lo esperado.",
            visible=True,
            created_at="2025-10-16",
            updated_at="2025-10-17",
        ),
        RepairOrderReview(
            id="3",
            repairOrderId="3",
            rating=3,
            comment="El problema se solucionó, pero tuve que regresar por un ajuste adicional.",
            visible=True,
            created_at="2025-10-17",
            updated_at="2025-10-18",
        ),
    ]

