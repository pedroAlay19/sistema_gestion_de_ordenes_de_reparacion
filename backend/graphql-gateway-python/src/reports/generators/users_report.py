import base64
from datetime import datetime
from weasyprint import HTML
import os

# Ruta del directorio donde están los templates
BASE_DIR = os.path.dirname(__file__)
TEMPLATES_DIR = os.path.join(BASE_DIR, "..", "templates")


def safe(value):
    """
    Convierte valores nulos, vacíos o inexistentes en 'No registra'.
    """
    if value is None or value == "" or str(value).strip() == "":
        return "No registra"
    return value


def generate_users_report(users: list) -> str:
    """
    Genera un PDF con la lista completa de usuarios y lo devuelve en base64.
    Esta versión NO usa assets (imágenes ni recursos externos).
    """

    # Cargar el archivo HTML base
    template_path = os.path.join(TEMPLATES_DIR, "users_report.html")

    with open(template_path, "r", encoding="utf-8") as f:
        template = f.read()

    # -------------------------
    # Construcción dinámica de filas
    # -------------------------
    rows_html = ""
    for u in users:
        rows_html += f"""
        <tr>
            <td>{safe(u.get("id"))}</td>
            <td>{safe(u.get("name"))}</td>
            <td>{safe(u.get("lastName"))}</td>
            <td>{safe(u.get("email"))}</td>
            <td>{safe(u.get("phone"))}</td>
            <td>{safe(u.get("address"))}</td>
            <td>{safe(u.get("createdAt"))}</td>
            <td>{safe(u.get("role"))}</td>
        </tr>
        """

    # Reemplazar marcadores en el HTML
    html_final = template.replace("{{rows}}", rows_html)
    html_final = html_final.replace(
        "{{generated_date}}",
        datetime.now().strftime("%d/%m/%Y %H:%M")
    )

    # Generar el PDF con WeasyPrint
    pdf_bytes = HTML(string=html_final).write_pdf()

    # Convertir PDF a Base64 para enviarlo vía GraphQL
    pdf_b64 = base64.b64encode(pdf_bytes).decode("utf-8")

    return pdf_b64
