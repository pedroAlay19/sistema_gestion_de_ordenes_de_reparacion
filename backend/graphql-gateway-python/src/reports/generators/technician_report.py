import base64
from datetime import datetime
from weasyprint import HTML
import os

BASE_DIR = os.path.dirname(__file__)
TEMPLATES_DIR = os.path.join(BASE_DIR, "..", "templates")


def safe(value):
    """Convierte valores vacíos o None en 'No registra'."""
    if value is None or value == "" or str(value).strip() == "":
        return "No registra"
    return str(value)


def generate_technician_report(tech: dict) -> str:
    """Genera un PDF con los datos de un técnico específico."""

    template_path = os.path.join(TEMPLATES_DIR, "technician_report.html")

    with open(template_path, "r", encoding="utf-8") as f:
        template = f.read()

    # Reemplazar campos
    html_final = template.replace("{{id}}", safe(tech.get("id")))
    html_final = html_final.replace("{{name}}", safe(tech.get("name")))
    html_final = html_final.replace("{{lastName}}", safe(tech.get("lastName")))
    html_final = html_final.replace("{{email}}", safe(tech.get("email")))
    html_final = html_final.replace("{{phone}}", safe(tech.get("phone")))
    html_final = html_final.replace("{{address}}", safe(tech.get("address")))
    html_final = html_final.replace("{{specialty}}", safe(tech.get("specialty")))
    html_final = html_final.replace("{{experienceYears}}", safe(tech.get("experienceYears")))
    html_final = html_final.replace("{{isEvaluator}}", "Sí" if tech.get("isEvaluator") else "No")
    html_final = html_final.replace("{{active}}", "Sí" if tech.get("active") else "No")

    html_final = html_final.replace(
        "{{generated_date}}",
        datetime.now().strftime("%d/%m/%Y %H:%M")
    )

    # Generar PDF
    pdf_bytes = HTML(string=html_final).write_pdf()

    return base64.b64encode(pdf_bytes).decode("utf-8")
