import strawberry
from typing import List
# 🔹 Tipo GraphQL para los detalles de una orden de reparación
@strawberry.type
class RepairOrderDetail:
    id: str
    repairOrderId: str
    serviceName: str
    technicianName: str
    unitPrice: float
    discount: float
    subTotal: float
    status: str
    imageUrl: str
    notes: str
    created_at: str
    updated_at: str


# 🔹 Datos simulados (detalles de servicios realizados)
def get_repair_order_details() -> List[RepairOrderDetail]:
    return [
        RepairOrderDetail(
            id="1",
            repairOrderId="1",
            serviceName="Cambio de fuente de poder",
            technicianName="Andrés García",
            unitPrice=45.00,
            discount=0.00,
            subTotal=45.00,
            status="COMPLETED",
            imageUrl="https://example.com/img/fuente_evga.jpg",
            notes="Se reemplazó la fuente dañada por una nueva EVGA 500W.",
            created_at="2025-10-10",
            updated_at="2025-10-15",
        ),
        RepairOrderDetail(
            id="2",
            repairOrderId="2",
            serviceName="Reemplazo de pantalla",
            technicianName="Paola Reyes",
            unitPrice=80.00,
            discount=5.00,
            subTotal=75.00,
            status="IN_PROGRESS",
            imageUrl="https://example.com/img/screen_a52.jpg",
            notes="Pantalla original Samsung instalada, pendiente prueba final.",
            created_at="2025-10-14",
            updated_at="2025-10-17",
        ),
        RepairOrderDetail(
            id="3",
            repairOrderId="3",
            serviceName="Mantenimiento preventivo completo",
            technicianName="Carlos Loor",
            unitPrice=50.00,
            discount=10.00,
            subTotal=40.00,
            status="PENDING",
            imageUrl="https://example.com/img/mantenimiento_pc.jpg",
            notes="Limpieza interna, cambio de pasta térmica y ajuste de ventiladores.",
            created_at="2025-10-15",
            updated_at="2025-10-18",
        ),
    ]
