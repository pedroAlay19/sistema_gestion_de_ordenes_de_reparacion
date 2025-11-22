import strawberry
import base64
from weasyprint import HTML


@strawberry.type
class TestQuery:

    @strawberry.field
    def test_pdf(self) -> str:
        html = """
        <html>
            <body>
                <h1 style="color: blue;">PDF generado desde GraphQL</h1>
                <p>Esta es una prueba básica usando WeasyPrint.</p>
            </body>
        </html>
        """

        pdf_bytes = HTML(string=html).write_pdf()
        return base64.b64encode(pdf_bytes).decode('utf-8')