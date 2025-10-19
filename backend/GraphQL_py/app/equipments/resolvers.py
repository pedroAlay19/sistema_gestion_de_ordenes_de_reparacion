import strawberry
from typing import List
# 🔹 Tipo GraphQL para los equipos tecnológicos registrados
@strawberry.type
class Equipment:
    id: str
    userName: str
    name: str
    type: str
    brand: str
    model: str
    serialNumber: str
    observations: str
    currentStatus: str
    created_at: str


# 🔹 Datos simulados (equipos en reparación o mantenimiento)
def get_equipments() -> List[Equipment]:
    return [
        Equipment(
            id="1",
            userName="Carlos Delgado",
            name="Laptop HP Pavilion 15",
            type="LAPTOP",
            brand="HP",
            model="Pavilion 15-eg0000",
            serialNumber="HP2025-8899",
            observations="No enciende y presenta sobrecalentamiento.",
            currentStatus="IN_REPAIR",
            created_at="2025-10-10",
        ),
        Equipment(
            id="2",
            userName="Ana López",
            name="Teléfono Samsung Galaxy A52",
            type="PHONE",
            brand="Samsung",
            model="A52 SM-A525F",
            serialNumber="SAM-5522-AC",
            observations="Pantalla rota, necesita reemplazo.",
            currentStatus="WAITING_PARTS",
            created_at="2025-10-12",
        ),
        Equipment(
            id="3",
            userName="Paola Reyes",
            name="Computadora de Escritorio Dell",
            type="PC",
            brand="Dell",
            model="Inspiron 3880",
            serialNumber="DL-9983X",
            observations="Ventilador ruidoso y reinicios aleatorios.",
            currentStatus="DIAGNOSING",
            created_at="2025-10-15",
        ),
        Equipment(
            id="4",
            userName="Luis García",
            name="Tablet Lenovo Tab M10",
            type="TABLET",
            brand="Lenovo",
            model="TB-X606F",
            serialNumber="LN-TAB-4420",
            observations="Batería se descarga rápido.",
            currentStatus="COMPLETED",
            created_at="2025-10-17",
        ),
    ]
