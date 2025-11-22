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


def generate_equipment_report(equipment: dict) -> str:
    template_path = os.path.join(TEMPLATES_DIR, "equipment_report.html")

    with open(template_path, "r", encoding="utf-8") as f:
        template = f.read()

    # Cliente dueño del equipo
    user = equipment.get("user") or {}

    # Órdenes del equipo
    orders = equipment.get("repairOrders") or []

    # --- Filas de órdenes ---
    orders_rows = ""

    if orders:
        for o in orders:
            orders_rows += f"""
            <tr>
                <td>{safe(o.get("id"))}</td>
                <td>{safe(o.get("problemDescription"))}</td>
                <td>{safe(o.get("diagnosis"))}</td>
                <td>{safe(o.get("estimatedCost"))}</td>
                <td>{safe(o.get("finalCost"))}</td>
                <td>{safe(o.get("status"))}</td>
                <td>{safe(o.get("createdAt"))}</td>
            </tr>
            """
    else:
        orders_rows = """
        <tr>
            <td colspan="7">Este equipo no tiene órdenes de reparación registradas.</td>
        </tr>
        """

    html_final = template

    # Equipo
    html_final = html_final.replace("{{equipment_id}}", safe(equipment.get("id")))
    html_final = html_final.replace("{{equipment_name}}", safe(equipment.get("name")))
    html_final = html_final.replace("{{equipment_type}}", safe(equipment.get("type")))
    html_final = html_final.replace("{{equipment_brand}}", safe(equipment.get("brand")))
    html_final = html_final.replace("{{equipment_model}}", safe(equipment.get("model")))
    html_final = html_final.replace("{{equipment_serialNumber}}", safe(equipment.get("serialNumber")))
    html_final = html_final.replace("{{equipment_status}}", safe(equipment.get("currentStatus")))
    html_final = html_final.replace("{{equipment_createdAt}}", safe(equipment.get("createdAt")))

    # Cliente dueño
    html_final = html_final.replace("{{user_name}}", safe(user.get("name")))
    html_final = html_final.replace("{{user_lastName}}", safe(user.get("lastName")))
    html_final = html_final.replace("{{user_email}}", safe(user.get("email")))
    html_final = html_final.replace("{{user_phone}}", safe(user.get("phone")))
    html_final = html_final.replace("{{user_address}}", safe(user.get("address")))

    # Órdenes
    html_final = html_final.replace("{{orders_rows}}", orders_rows)

    # Fecha de generación
    html_final = html_final.replace(
        "{{generated_date}}",
        datetime.now().strftime("%d/%m/%Y %H:%M")
    )

    pdf_bytes = HTML(string=html_final).write_pdf()
    return base64.b64encode(pdf_bytes).decode("utf-8")
