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


def generate_repair_orders_by_status_report(orders: list, status: str) -> str:
    template_path = os.path.join(TEMPLATES_DIR, "repair_orders_by_status_report.html")

    with open(template_path, "r", encoding="utf-8") as f:
        template = f.read()

    rows = ""
    total_sum = 0
    count = 0

    if orders:
        for o in orders:
            count += 1

            #   CAMPOS REALES SEGÚN TU REST

            equipment = o.get("equipment") or {}
            client = equipment.get("user") or {}

            tech = o.get("evaluatedBy") or {}

            # Total real: finalCost (NO "total")
            total = float(o.get("finalCost") or 0)
            total_sum += total

            rows += f"""
            <tr>
                <td>{safe(o.get("id"))}</td>
                <td>{safe(client.get("name"))} {safe(client.get("lastName"))}</td>
                <td>{safe(tech.get("name"))} {safe(tech.get("lastName"))}</td>
                <td>{safe(o.get("status"))}</td>
                <td>${total:.2f}</td>
                <td>{safe(o.get("createdAt"))}</td>
            </tr>
            """
    else:
        rows = """
        <tr>
            <td colspan="6">No existen órdenes con este estado.</td>
        </tr>
        """

    html_final = template
    html_final = html_final.replace("{{status}}", safe(status))
    html_final = html_final.replace("{{orders_rows}}", rows)
    html_final = html_final.replace("{{total_orders}}", str(count))
    html_final = html_final.replace("{{total_sum}}", f"${total_sum:.2f}")
    html_final = html_final.replace(
        "{{generated_date}}",
        datetime.now().strftime("%d/%m/%Y %H:%M")
    )

    pdf_bytes = HTML(string=html_final).write_pdf()
    return base64.b64encode(pdf_bytes).decode("utf-8")
