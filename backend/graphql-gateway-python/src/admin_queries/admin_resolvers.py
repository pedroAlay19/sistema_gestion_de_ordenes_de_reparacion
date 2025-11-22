import strawberry
from typing import List, Optional
from strawberry.types import Info
from reports.generators.users_report import generate_users_report
from reports.generators.technician_report import generate_technician_report
from .admin_types import (
    UserType,
    SparePartType,
    MaintenanceServiceType,
    RepairOrderType,
    TechnicianType,
    RepairOrderFullType,
    TechnicianPerformanceType,
    EquipmentType,
)
from . import admin_service
from reports.generators.users_report import generate_users_report
from reports.generators.repair_order_report import generate_repair_order_report
from reports.generators.equipment_report import generate_equipment_report
from reports.generators.spare_parts_report import generate_spare_parts_report
from reports.generators.repair_orders_by_status_report import generate_repair_orders_by_status_report
from reports.generators.spare_parts_low_stock_report import generate_spare_parts_low_stock_report
from reports.generators.technicians_performance_report import generate_technicians_performance_report


def _extract_auth(info: Info) -> Optional[str]:
    """
    Extrae el token JWT desde los headers globales de GraphiQL.
    Ya no depende de argumentos en el schema.
    """

    try:
        request = info.context.get("request")
        if not request:
            return None

        token = request.headers.get("authorization")
        if not token:
            return None

        # Asegurar "Bearer "
        if not token.startswith("Bearer "):
            token = f"Bearer {token}"

        return token

    except Exception:
        return None


@strawberry.type
class AdminQueries:

    @strawberry.field
    def users(self, info: Info) -> List[UserType]:
        token = _extract_auth(info)
        return admin_service.get_users(auth_header=token)
    
    @strawberry.field
    def technicians(self, info) -> List[TechnicianType]:
        token = _extract_auth(info)
        return admin_service.get_technicians(auth_header=token)

    @strawberry.field
    def user(self, info: Info, id: str) -> Optional[UserType]:
        token = _extract_auth(info)
        return admin_service.get_user(id, auth_header=token)
    
    @strawberry.field
    def technician(self, info: Info, id: str) -> Optional[TechnicianType]:
        token = _extract_auth(info)
        return admin_service.get_technician(id, auth_header=token)

    @strawberry.field
    def spare_parts(self, info: Info) -> List[SparePartType]:
        token = _extract_auth(info)
        return admin_service.get_spare_parts(auth_header=token)

    @strawberry.field
    def services(self, info: Info) -> List[MaintenanceServiceType]:
        token = _extract_auth(info)
        return admin_service.get_services(auth_header=token)

    @strawberry.field
    def repair_orders(self, info: Info) -> List[RepairOrderType]:
        token = _extract_auth(info)
        return admin_service.get_repair_orders(auth_header=token)
    
    
    @strawberry.field
    def repair_orders_by_status(self, info: Info, status: str) -> List[RepairOrderFullType]:
        token = _extract_auth(info)
        orders = admin_service.get_repair_orders_raw(auth_header=token)

        results = []
        for o in orders:
            if o.get("status") != status:
                continue

            equipment = o.get("equipment") or {}
            client = equipment.get("user") or {}
            tech = o.get("evaluatedBy") or {}

            results.append(
                RepairOrderFullType(
                    id=o.get("id"),
                    status=o.get("status"),
                    finalCost=float(o.get("finalCost") or 0),
                    createdAt=o.get("createdAt"),

                    clientName=client.get("name"),
                    clientLastName=client.get("lastName"),

                    technicianName=tech.get("name"),
                    technicianLastName=tech.get("lastName"),

                    equipmentName=equipment.get("name"),
                    equipmentType=equipment.get("type"),
                )
            )
        return results
    

    @strawberry.field
    def spare_parts_low_stock(self, info: Info, threshold: int = 5) -> List[SparePartType]:
        token = _extract_auth(info)
        parts = admin_service.get_spare_parts_raw(auth_header=token)
        low = [p for p in parts if (p.get("stock") or 0) <= threshold]

        return [
            SparePartType(
                id=p.get("id"),
                name=p.get("name"),
                price=float(p.get("price") or 0),
                stock=p.get("stock")
            ) for p in low
        ]
    

    @strawberry.field
    def technicians_performance(self, info: Info) -> List[TechnicianPerformanceType]:
        token = _extract_auth(info)
        orders = admin_service.get_repair_orders_raw(auth_header=token)

        # Agrupar órdenes por técnico
        map_perf = {}

        for o in orders:
            tech = o.get("evaluatedBy") or {}
            tech_id = tech.get("id")
            if not tech_id:
                continue

            if tech_id not in map_perf:
                map_perf[tech_id] = {
                    "name": tech.get("name"),
                    "last": tech.get("lastName"),
                    "count": 0,
                    "revenue": 0.0
                }

            map_perf[tech_id]["count"] += 1
            map_perf[tech_id]["revenue"] += float(o.get("finalCost") or 0)

        # Convertir a lista
        return [
            TechnicianPerformanceType(
                technicianName=v["name"],
                technicianLastName=v["last"],
                totalOrders=v["count"],
                totalRevenue=v["revenue"]
            )
            for v in map_perf.values()
        ]
    

    #Reportes PDF

    @strawberry.field
    def users_report(self, info: Info) -> str:
        """
        Reporte PDF de todos los usuarios.
        Devuelve un string Base64 generado por WeasyPrint.
        """
        token = _extract_auth(info)

        # Datos completos del REST (JSON puro)
        users = admin_service.get_users_raw(auth_header=token)

        # Generar PDF
        return generate_users_report(users)
    

    
    @strawberry.field
    def technician_report(self, info: Info, id: str) -> str:
        token = _extract_auth(info)

        technician = admin_service.get_technician_raw(id, auth_header=token)

        return generate_technician_report(technician)
    


    @strawberry.field
    def repair_order_report(self, info: Info, id: str) -> str:
        """
        Reporte PDF de una orden de reparación.
        Devuelve un string Base64 generado por WeasyPrint.
        """
        token = _extract_auth(info)
        order = admin_service.get_repair_order_raw(id, auth_header=token)
        return generate_repair_order_report(order)
    

    @strawberry.field
    def equipment_report(self, info: Info, id: str) -> str:
        """
        Reporte PDF de un equipo específico.
        Devuelve un string Base64 generado por WeasyPrint.
        """
        token = _extract_auth(info)
        equipment = admin_service.get_equipment_raw(id, auth_header=token)
        return generate_equipment_report(equipment)
    

    @strawberry.field
    def spare_parts_report(self, info: Info) -> str:
        token = _extract_auth(info)
        parts = admin_service.get_spare_parts_raw(auth_header=token)
        return generate_spare_parts_report(parts)
    
    
    # ---- RENDIMIENTO DE TÉCNICOS ----
    @strawberry.field
    def technicians_performance_report(self, info: Info) -> str:
        token = _extract_auth(info)

        techs = admin_service.get_technicians_raw(auth_header=token)
        orders = admin_service.get_repair_orders_raw(auth_header=token)

        return generate_technicians_performance_report(techs, orders)

        
    
    @strawberry.field
    def repair_orders_by_status_report(self, info: Info, status: str) -> str:
        token = _extract_auth(info)
        orders = admin_service.get_repair_orders_raw(auth_header=token)
        filtered = [o for o in orders if o.get("status") == status]
        return generate_repair_orders_by_status_report(filtered, status)


    @strawberry.field
    def spare_parts_low_stock_report(self, info: Info, threshold: int = 5) -> str:
        token = _extract_auth(info)
        parts = admin_service.get_spare_parts_raw(auth_header=token)

        low = [p for p in parts if (p.get("stock") or 0) <= threshold]

        return generate_spare_parts_low_stock_report(low, threshold)


    @strawberry.field
    def equipments(self, info: Info) -> List[EquipmentType]:
        token = _extract_auth(info)
        items = admin_service.get_equipments_raw(auth_header=token)

        out = []
        for e in items:
            out.append(
                EquipmentType(
                    id=e.get("id"),
                    name=e.get("name"),
                    type=e.get("type"),
                    brand=e.get("brand"),
                    model=e.get("model"),
                    serialNumber=e.get("serialNumber"),
                    currentStatus=e.get("currentStatus"),
                    createdAt=e.get("createdAt"),
                )
            )
        return out
    

    @strawberry.field
    def equipment(self, info: Info, id: str) -> Optional[EquipmentType]:
        token = _extract_auth(info)
        data = admin_service.get_equipment_raw(id, auth_header=token)

        user = (data.get("user") or {})

        return EquipmentType(
            id=data.get("id"),
            name=data.get("name"),
            type=data.get("type"),
            brand=data.get("brand"),
            model=data.get("model"),
            serialNumber=data.get("serialNumber"),
            createdAt=data.get("createdAt"),
            currentStatus=data.get("currentStatus"),

            userName=user.get("name"),
            userLastName=user.get("lastName"),
        )

