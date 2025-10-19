import strawberry
from typing import List

# 🔹 Tipo GraphQL para los servicios de mantenimiento disponibles
@strawberry.type
class MaintenanceService:
    id: str
    serviceName: str
    description: str
    basePrice: float
    estimatedTimeMinutes: int
    requiresParts: bool
    type: str
    imageUrls: list[str]
    active: bool
    notes: str


# 🔹 Datos simulados de servicios tecnológicos
def get_maintenance_services() -> List[MaintenanceService]:
    return [
        MaintenanceService(
            id="1",
            serviceName="Mantenimiento preventivo de laptop",
            description="Limpieza interna, revisión de ventiladores y cambio de pasta térmica.",
            basePrice=35.00,
            estimatedTimeMinutes=60,
            requiresParts=False,
            type="HARDWARE",
            imageUrls=[
                "https://example.com/img/mantenimiento_laptop_1.jpg",
                "https://example.com/img/mantenimiento_laptop_2.jpg",
            ],
            active=True,
            notes="Recomendado cada 6 meses para laptops que se calientan.",
        ),
        MaintenanceService(
            id="2",
            serviceName="Reinstalación de sistema operativo",
            description="Formateo del equipo y reinstalación de Windows/Linux, con drivers actualizados.",
            basePrice=25.00,
            estimatedTimeMinutes=90,
            requiresParts=False,
            type="SOFTWARE",
            imageUrls=[
                "https://example.com/img/reinstalacion_os.jpg"
            ],
            active=True,
            notes="Incluye respaldo de información si el usuario lo solicita.",
        ),
        MaintenanceService(
            id="3",
            serviceName="Cambio de pantalla de celular",
            description="Sustitución de pantalla dañada por repuesto original o genérico.",
            basePrice=60.00,
            estimatedTimeMinutes=120,
            requiresParts=True,
            type="HARDWARE",
            imageUrls=[
                "https://example.com/img/pantalla_celular_1.jpg"
            ],
            active=True,
            notes="El precio final depende del modelo y tipo de pantalla.",
        ),
        MaintenanceService(
            id="4",
            serviceName="Optimización de rendimiento",
            description="Limpieza de archivos, actualización de controladores y configuración de inicio.",
            basePrice=20.00,
            estimatedTimeMinutes=45,
            requiresParts=False,
            type="SOFTWARE",
            imageUrls=[
                "https://example.com/img/optimizacion_pc.jpg"
            ],
            active=True,
            notes="Ideal para equipos lentos o con exceso de programas en segundo plano.",
        ),
    ]
