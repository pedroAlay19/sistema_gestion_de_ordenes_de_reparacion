import strawberry
from typing import List

# 🔹 Tipo GraphQL para una orden de reparación (sin enum)
@strawberry.type
class RepairOrder:
    id: str
    equipment: str
    problemDescription: str
    diagnosis: str
    estimatedCost: float
    finalCost: float
    warrantyStartDate: str
    warrantyEndDate: str
    status: str              # ← reemplaza el enum por un string simple
    created_at: str
    updated_at: str


# 🔹 Datos simulados
def get_repair_orders() -> List[RepairOrder]:
    return [
        RepairOrder(
            id="1",
            equipment="Laptop HP Pavilion 15",
            problemDescription="No enciende al presionar el botón de encendido.",
            diagnosis="Fuente dañada y sobrecalentamiento de tarjeta madre.",
            estimatedCost=120.00,
            finalCost=125.50,
            warrantyStartDate="2025-10-10",
            warrantyEndDate="2026-04-10",
            status="COMPLETED",
            created_at="2025-10-01",
            updated_at="2025-10-15",
        ),
        RepairOrder(
            id="2",
            equipment="Teléfono Samsung Galaxy A52",
            problemDescription="Pantalla rota y batería con sobrecalentamiento.",
            diagnosis="Pantalla y batería deben ser reemplazadas.",
            estimatedCost=95.00,
            finalCost=98.00,
            warrantyStartDate="2025-10-12",
            warrantyEndDate="2026-04-12",
            status="IN_PROGRESS",
            created_at="2025-10-10",
            updated_at="2025-10-17",
        ),
        RepairOrder(
            id="3",
            equipment="PC Gamer Ryzen 7",
            problemDescription="Ruido constante del ventilador y apagado repentino.",
            diagnosis="Requiere limpieza interna y cambio de pasta térmica.",
            estimatedCost=50.00,
            finalCost=0.0,
            warrantyStartDate="",
            warrantyEndDate="",
            status="OPEN",
            created_at="2025-10-15",
            updated_at="2025-10-18",
        ),
    ]
