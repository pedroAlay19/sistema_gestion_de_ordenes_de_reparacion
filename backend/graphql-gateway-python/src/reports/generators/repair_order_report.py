import base64
from datetime import datetime
from weasyprint import HTML
import os

BASE_DIR = os.path.dirname(__file__)
TEMPLATES_DIR = os.path.join(BASE_DIR, "..", "templates")


def safe(value):
    """Convierte None o vacío en 'No registra' y siempre devuelve string."""
    if value is None:
        return "No registra"
    text = str(value).strip()
    if text == "":
        return "No registra"
    return text


def safe_bool(value):
    if value is True:
        return "Sí"
    if value is False:
        return "No"
    return "No registra"


def generate_repair_order_report(order: dict) -> str:
    """
    Genera un PDF con los datos de UNA orden de reparación.
    'order' es el JSON crudo que viene del REST /repair-orders/:id
    """

    template_path = os.path.join(TEMPLATES_DIR, "repair_order_report.html")

    with open(template_path, "r", encoding="utf-8") as f:
        template = f.read()

    # --- Datos anidados ---
    equipment = order.get("equipment") or {}
    tech = order.get("evaluatedBy") or {}

    # --- Filas de detalles ---
    details = (
        order.get("repairOrderDetails")
        or order.get("details")
        or []
    )

    details_rows = ""
    if details:
        for d in details:
            details_rows += f"""
            <tr>
                <td>{safe(d.get("id"))}</td>
                <td>{safe(d.get("unitPrice"))}</td>
                <td>{safe(d.get("discount"))}</td>
                <td>{safe(d.get("subTotal"))}</td>
                <td>{safe(d.get("status"))}</td>
                <td>{safe(d.get("notes"))}</td>
            </tr>
            """
    else:
        details_rows = """
        <tr>
            <td colspan="7">No registra detalles de servicios.</td>
        </tr>
        """

    # --- Filas de partes ---
    parts = order.get("repairOrderParts") or []
    parts_rows = ""
    if parts:
        for p in parts:
            parts_rows += f"""
            <tr>
                <td>{safe(p.get("id"))}</td>
                <td>{safe(p.get("quantity"))}</td>
                <td>{safe(p.get("subTotal"))}</td>
            </tr>
            """
    else:
        parts_rows = """
        <tr>
            <td colspan="4">No registra partes asociadas.</td>
        </tr>
        """

    # --- Reemplazar placeholders del HTML ---
    html_final = template

    # 1. Información general
    html_final = html_final.replace("{{order_id}}", safe(order.get("id")))
    html_final = html_final.replace("{{status}}", safe(order.get("status")))
    html_final = html_final.replace("{{problemDescription}}", safe(order.get("problemDescription")))
    html_final = html_final.replace("{{diagnosis}}", safe(order.get("diagnosis")))
    html_final = html_final.replace("{{estimatedCost}}", safe(order.get("estimatedCost")))
    html_final = html_final.replace("{{finalCost}}", safe(order.get("finalCost")))
    html_final = html_final.replace("{{warrantyStartDate}}", safe(order.get("warrantyStartDate")))
    html_final = html_final.replace("{{warrantyEndDate}}", safe(order.get("warrantyEndDate")))
    html_final = html_final.replace("{{createdAt}}", safe(order.get("createdAt")))

    # 3. Equipo
    html_final = html_final.replace("{{equipment_name}}", safe(equipment.get("name")))
    html_final = html_final.replace("{{equipment_type}}", safe(equipment.get("type")))
    html_final = html_final.replace("{{equipment_brand}}", safe(equipment.get("brand")))
    html_final = html_final.replace("{{equipment_model}}", safe(equipment.get("model")))
    html_final = html_final.replace("{{equipment_serialNumber}}", safe(equipment.get("serialNumber")))
    html_final = html_final.replace("{{equipment_currentStatus}}", safe(equipment.get("currentStatus")))

    # 4. Técnico
    html_final = html_final.replace("{{tech_name}}", safe(tech.get("name")))
    html_final = html_final.replace("{{tech_lastName}}", safe(tech.get("lastName")))
    html_final = html_final.replace("{{tech_email}}", safe(tech.get("email")))

    # 5. tablas de detalles y partes
    html_final = html_final.replace("{{details_rows}}", details_rows)
    html_final = html_final.replace("{{parts_rows}}", parts_rows)

    # 6. fecha de generación
    html_final = html_final.replace(
        "{{generated_date}}",
        datetime.now().strftime("%d/%m/%Y %H:%M")
    )

    # --- Generar PDF ---
    pdf_bytes = HTML(string=html_final).write_pdf()
    return base64.b64encode(pdf_bytes).decode("utf-8")
