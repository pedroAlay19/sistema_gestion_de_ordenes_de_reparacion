import uvicorn
from strawberry.asgi import GraphQL
from .schema import schema

app = GraphQL(schema, graphiql=True)

if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)
