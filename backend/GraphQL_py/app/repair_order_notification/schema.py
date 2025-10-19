import strawberry
from app.repair_order_notification.resolvers import RepairOrderNotification, get_repair_order_notifications


@strawberry.type
class RepairOrderNotificationQuery:
    repair_order_notifications = strawberry.field(resolver=get_repair_order_notifications)
