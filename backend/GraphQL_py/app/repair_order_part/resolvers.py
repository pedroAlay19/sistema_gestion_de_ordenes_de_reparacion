import strawberry
from typing import List

# 🔹 Tipo GraphQL para las piezas usadas en una orden de reparación
@strawberry.type
class RepairOrderPart:
    id: str
    repairOrderId: str
    partName: str
    quantity: int
    subTotal: float
    imgUrl: str
    created_at: str
    updated_at: str


# 🔹 Datos simulados (repuestos usados en reparaciones de equipos tecnológicos)
def get_repair_order_parts() -> List[RepairOrderPart]:
    return [
        RepairOrderPart(
            id="1",
            repairOrderId="1",
            partName="Fuente de poder 500W EVGA",
            quantity=1,
            subTotal=45.00,
            imgUrl="https://example.com/img/fuente_evga.jpg",
            created_at="2025-10-10",
            updated_at="2025-10-15",
        ),
        RepairOrderPart(
            id="2",
            repairOrderId="2",
            partName="Pantalla Samsung A52 original",
            quantity=1,
            subTotal=80.00,
            imgUrl="https://example.com/img/screen_a52.jpg",
            created_at="2025-10-12",
            updated_at="2025-10-17",
        ),
        RepairOrderPart(
            id="3",
            repairOrderId="2",
            partName="Batería Samsung A52",
            quantity=1,
            subTotal=25.00,
            imgUrl="https://example.com/img/battery_a52.jpg",
            created_at="2025-10-12",
            updated_at="2025-10-17",
        ),
        RepairOrderPart(
            id="4",
            repairOrderId="3",
            partName="Pasta térmica Cooler Master",
            quantity=1,
            subTotal=8.50,
            imgUrl="https://example.com/img/pasta_termica.jpg",
            created_at="2025-10-15",
            updated_at="2025-10-18",
        ),
    ]
