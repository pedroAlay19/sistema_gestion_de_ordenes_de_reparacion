import strawberry
from app.repair_order_review.resolvers import RepairOrderReview, get_repair_order_reviews


@strawberry.type
class RepairOrderReviewQuery:
    repair_order_reviews = strawberry.field(resolver=get_repair_order_reviews)
