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


def generate_spare_parts_low_stock_report(parts: list, threshold: int = 5) -> str:
    template_path = os.path.join(TEMPLATES_DIR, "spare_parts_low_stock_report.html")

    with open(template_path, "r", encoding="utf-8") as f:
        template = f.read()

    rows = ""
    count = 0

    if parts:
        for p in parts:
            stock = int(p.get("stock", 0) or 0)
            if stock <= threshold:
                count += 1
                price = float(p.get("price", 0) or 0)
                rows += f"""
                <tr>
                    <td>{safe(p.get("id"))}</td>
                    <td>{safe(p.get("name"))}</td>
                    <td>{stock}</td>
                    <td>${price:.2f}</td>
                </tr>
                """
    if rows == "":
        rows = f"""
        <tr>
            <td colspan="4">No hay repuestos con stock menor o igual a {threshold}.</td>
        </tr>
        """

    html_final = template
    html_final = html_final.replace("{{threshold}}", str(threshold))
    html_final = html_final.replace("{{count_low_stock}}", str(count))
    html_final = html_final.replace("{{parts_rows}}", rows)
    html_final = html_final.replace(
        "{{generated_date}}",
        datetime.now().strftime("%d/%m/%Y %H:%M")
    )

    pdf_bytes = HTML(string=html_final).write_pdf()
    return base64.b64encode(pdf_bytes).decode("utf-8")
