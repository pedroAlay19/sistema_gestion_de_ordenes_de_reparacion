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


def generate_technicians_performance_report(techs: list, orders: list) -> str:
    template_path = os.path.join(TEMPLATES_DIR, "technicians_performance_report.html")

    with open(template_path, "r", encoding="utf-8") as f:
        template = f.read()

    # -----------------------------------------
    # 1) Calcular rendimiento por técnico
    # -----------------------------------------
    perf_map = {}

    for o in orders or []:
        # Obtener técnicos asignados a servicios (RepairOrderDetails)
        details = o.get("repairOrderDetails") or []
        
        # Si hay detalles con técnicos asignados, contar por cada técnico
        if details:
            for detail in details:
                tech = detail.get("technician") or {}
                tech_id = tech.get("id")
                
                if tech_id:
                    if tech_id not in perf_map:
                        perf_map[tech_id] = {"orders": 0, "income": 0.0}
                    
                    # Contar cada detalle como una orden de servicio
                    perf_map[tech_id]["orders"] += 1
                    # Sumar el subtotal del servicio específico
                    perf_map[tech_id]["income"] += float(detail.get("subTotal") or 0)
        else:
            # Si no hay detalles, usar evaluatedBy como fallback
            tech = o.get("evaluatedBy") or {}
            tech_id = tech.get("id")
            
            if tech_id:
                if tech_id not in perf_map:
                    perf_map[tech_id] = {"orders": 0, "income": 0.0}
                
                perf_map[tech_id]["orders"] += 1
                perf_map[tech_id]["income"] += float(o.get("finalCost") or 0)

    # -----------------------------------------
    # 2) Pintar filas por técnico
    # -----------------------------------------
    rows = ""
    global_orders = 0
    global_income = 0.0

    for t in techs or []:
        tech_id = t.get("id")
        orders_count = perf_map.get(tech_id, {}).get("orders", 0)
        income_total = perf_map.get(tech_id, {}).get("income", 0.0)

        global_orders += orders_count
        global_income += income_total

        full_name = f"{safe(t.get('name'))} {safe(t.get('lastName'))}"

        rows += f"""
        <tr>
            <td>{safe(tech_id)}</td>
            <td>{full_name}</td>
            <td>{safe(t.get("email"))}</td>
            <td>{safe(t.get("specialty"))}</td>
            <td>{safe(t.get("experienceYears"))}</td>
            <td>{"Activo" if t.get("active") else "Inactivo"}</td>
            <td>{orders_count}</td>
            <td>${income_total:.2f}</td>
        </tr>
        """

    if not rows:
        rows = """
        <tr>
            <td colspan="8">No existen técnicos registrados.</td>
        </tr>
        """

    html_final = template
    html_final = html_final.replace("{{rows}}", rows)
    html_final = html_final.replace("{{total_technicians}}", str(len(techs or [])))
    html_final = html_final.replace("{{global_orders}}", str(global_orders))
    html_final = html_final.replace("{{global_income}}", f"{global_income:.2f}")
    html_final = html_final.replace(
        "{{generated_date}}",
        datetime.now().strftime("%d/%m/%Y %H:%M")
    )

    pdf_bytes = HTML(string=html_final).write_pdf()
    return base64.b64encode(pdf_bytes).decode("utf-8")

