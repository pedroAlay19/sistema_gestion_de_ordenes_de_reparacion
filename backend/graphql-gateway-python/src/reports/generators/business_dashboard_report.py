import base64
from datetime import datetime
from weasyprint import HTML
import os

BASE_DIR = os.path.dirname(__file__)
TEMPLATES_DIR = os.path.join(BASE_DIR, "..", "templates")


def safe(v, default="0"):
    if v is None:
        return default
    return str(v)


def generate_business_dashboard_report(data: dict) -> str:
    template_path = os.path.join(TEMPLATES_DIR, "business_dashboard_report.html")

    with open(template_path, "r", encoding="utf-8") as f:
        template = f.read()

    html_final = template
    html_final = html_final.replace("{{total_users}}", safe(data.get("totalUsers")))
    html_final = html_final.replace("{{total_clients}}", safe(data.get("totalClients")))
    html_final = html_final.replace("{{total_technicians}}", safe(data.get("totalTechnicians")))
    html_final = html_final.replace("{{active_technicians}}", safe(data.get("activeTechnicians")))
    html_final = html_final.replace("{{total_orders}}", safe(data.get("totalRepairOrders")))
    html_final = html_final.replace("{{total_services}}", safe(data.get("totalMaintenanceServices")))
    html_final = html_final.replace("{{low_stock_count}}", safe(data.get("stockCriticalCount")))

    html_final = html_final.replace(
        "{{generated_date}}",
        datetime.now().strftime("%d/%m/%Y %H:%M")
    )

    pdf_bytes = HTML(string=html_final).write_pdf()
    return base64.b64encode(pdf_bytes).decode("utf-8")
