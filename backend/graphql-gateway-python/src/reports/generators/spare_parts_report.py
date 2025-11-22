import base64
from datetime import datetime
from weasyprint import HTML
import os

BASE_DIR = os.path.dirname(__file__)
TEMPLATES_DIR = os.path.join(BASE_DIR, "..", "templates")


def safe(value):
    if value is None:
        return "No registra"
    text = str(value).strip()
    if text == "":
        return "No registra"
    return text


def generate_spare_parts_report(parts: list) -> str:
    template_path = os.path.join(TEMPLATES_DIR, "spare_parts_report.html")

    with open(template_path, "r", encoding="utf-8") as f:
        template = f.read()

    # --- filas dinámicas ---
    rows = ""

    if parts:
        for p in parts:
            rows += f"""
            <tr>
                <td>{safe(p.get("id"))}</td>
                <td>{safe(p.get("name"))}</td>
                <td>{safe(p.get("description"))}</td>
                <td>{safe(p.get("stock"))}</td>
                <td>{safe(p.get("unitPrice"))}</td>
                <td>{safe(p.get("createdAt"))}</td>
            </tr>
        """
    else:
        rows = """
        <tr>
            <td colspan="7">No hay repuestos registrados.</td>
        </tr>
        """

    html_final = template.replace("{{rows}}", rows)

    html_final = html_final.replace(
        "{{generated_date}}",
        datetime.now().strftime("%d/%m/%Y %H:%M")
    )

    pdf_bytes = HTML(string=html_final).write_pdf()
    return base64.b64encode(pdf_bytes).decode("utf-8")
