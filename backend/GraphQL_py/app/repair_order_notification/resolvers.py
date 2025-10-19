import strawberry
from typing import List

# 🔹 Tipo GraphQL para notificaciones de órdenes de reparación
@strawberry.type
class RepairOrderNotification:
    id: str
    repairOrderId: str
    title: str
    message: str
    sentAt: str
    status: str
    created_at: str


# 🔹 Datos simulados (notificaciones reales del proceso de reparación tecnológica)
def get_repair_order_notifications() -> List[RepairOrderNotification]:
    return [
        RepairOrderNotification(
            id="1",
            repairOrderId="1",
            title="Orden completada",
            message="Tu laptop HP Pavilion ha sido reparada y está lista para recoger.",
            sentAt="2025-10-15T10:30:00Z",
            status="SENT",
            created_at="2025-10-15T10:00:00Z",
        ),
        RepairOrderNotification(
            id="2",
            repairOrderId="2",
            title="Repuestos recibidos",
            message="Las piezas necesarias para tu Samsung Galaxy A52 han llegado. Reparación en curso.",
            sentAt="2025-10-14T15:20:00Z",
            status="SENT",
            created_at="2025-10-14T15:00:00Z",
        ),
        RepairOrderNotification(
            id="3",
            repairOrderId="2",
            title="Reparación finalizada",
            message="Tu Samsung Galaxy A52 ya fue reparado y está disponible para entrega.",
            sentAt="2025-10-17T12:45:00Z",
            status="SENT",
            created_at="2025-10-17T12:00:00Z",
        ),
        RepairOrderNotification(
            id="4",
            repairOrderId="3",
            title="Diagnóstico listo",
            message="Tu PC Gamer Ryzen 7 ya fue diagnosticada. Se requiere confirmación para continuar.",
            sentAt="2025-10-18T08:30:00Z",
            status="PENDING",
            created_at="2025-10-18T08:00:00Z",
        ),
    ]
