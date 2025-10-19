import strawberry
from typing import List
from app.maintenace_services.resolvers import MaintenanceService, get_maintenance_services


@strawberry.type
class ServiceMaintenanceQuery:
    maintenance_services: List[MaintenanceService] = strawberry.field(resolver=get_maintenance_services)
