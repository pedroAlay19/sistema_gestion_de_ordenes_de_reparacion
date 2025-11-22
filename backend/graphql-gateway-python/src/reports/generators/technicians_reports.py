import base64
from datetime import datetime
from weasyprint import HTML
import os

BASE_DIR = os.path.dirname(__file__)
TEMPLATES_DIR = os.path.join(BASE_DIR, "..", "templates")


def safe(value):
    """
    Convierte valores nulos, vacíos o inexistentes en 'No registra'
    y booleans en 'Sí' / 'No'.
    """
    if value is True:
        return "Sí"
    if value is False:
        return "No"
    
    if value is None or value == "" or str(value).strip() == "":
        return "No registra"
    return value


def generate_technicians_report(technicians: list) -> str:
    template_path = os.path.join(TEMPLATES_DIR, "technicians_report.html")

    with open(template_path, "r", encoding="utf-8") as f:
        template = f.read()

    # Construcción dinámica de tarjetas
    cards_html = ""
    for t in technicians:
        cards_html += f"""
        <div class="card">
            <div class="field"><span class="label">ID:</span> {safe(t.get("id"))}</div>
            <div class="field"><span class="label">Nombres:</span> {safe(t.get("name"))}</div>
            <div class="field"><span class="label">Apellidos:</span> {safe(t.get("lastName"))}</div>
            <div class="field"><span class="label">Email:</span> {safe(t.get("email"))}</div>
            <div class="field"><span class="label">Teléfono:</span> {safe(t.get("phone"))}</div>
            <div class="field"><span class="label">Dirección:</span> {safe(t.get("address"))}</div>
            <div class="field"><span class="label">Especialidad:</span> {safe(t.get("specialty"))}</div>
            <div class="field"><span class="label">Años Exp.:</span> {safe(t.get("experienceYears"))}</div>
            <div class="field"><span class="label">Evaluador:</span> {safe(t.get("isEvaluator"))}</div>
            <div class="field"><span class="label">Activo:</span> {safe(t.get("active"))}</div>
            <div class="field"><span class="label">Fecha creación:</span> {safe(t.get("createdAt"))}</div>
            <div class="field"><span class="label">Fecha actualización:</span> {safe(t.get("updatedAt"))}</div>
        </div>
        """

    html_final = template \
        .replace("{{cards}}", cards_html) \
        .replace("{{generated_date}}", datetime.now().strftime("%d/%m/%Y %H:%M"))

    pdf_bytes = HTML(string=html_final).write_pdf()
    return base64.b64encode(pdf_bytes).decode("utf-8")
