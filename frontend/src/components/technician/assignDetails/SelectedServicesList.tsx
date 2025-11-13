import { XMarkIcon } from "@heroicons/react/24/outline";
import type { MaintenanceService } from "../../../types";
import type { Technician } from "../../../api";

interface ServiceSelection {
  service: MaintenanceService;
  technicianId: string;
  unitPrice: number;
  discount: number;
  notes: string;
}

interface SelectedServicesListProps {
  selections: ServiceSelection[];
  technicians: Technician[];
  onRemove: (serviceId: string) => void;
  onUpdate: (serviceId: string, updates: Partial<ServiceSelection>) => void;
  isEvaluator: boolean;
}

export function SelectedServicesList({
  selections,
  technicians,
  onRemove,
  onUpdate,
  isEvaluator,
}: SelectedServicesListProps) {
  if (selections.length === 0) return null;

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-gray-700">Servicios Seleccionados</p>
      {selections.map((sel) => (
        <div key={sel.service.id} className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h5 className="font-medium text-gray-900">{sel.service.serviceName}</h5>
              <p className="text-xs text-gray-600">{sel.service.description}</p>
            </div>
            <button
              onClick={() => onRemove(sel.service.id)}
              className="text-red-600 hover:text-red-800"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Técnico *
            </label>
            <select
              value={sel.technicianId}
              onChange={(e) => onUpdate(sel.service.id, { technicianId: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Seleccionar técnico</option>
              {technicians.map((tech) => (
                <option key={tech.id} value={tech.id}>
                  {tech.name} {tech.lastName} - {tech.specialty}
                </option>
              ))}
            </select>
          </div>

          {/* Solo mostrar campos de precio, descuento y notas si NO es evaluador */}
          {!isEvaluator && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Precio</label>
                  <input
                    type="number"
                    step="0.01"
                    value={sel.unitPrice}
                    onChange={(e) => onUpdate(sel.service.id, { unitPrice: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Descuento</label>
                  <input
                    type="number"
                    step="0.01"
                    value={sel.discount}
                    onChange={(e) => onUpdate(sel.service.id, { discount: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Notas *</label>
                <textarea
                  value={sel.notes}
                  onChange={(e) => onUpdate(sel.service.id, { notes: e.target.value })}
                  placeholder="Descripción del trabajo realizado..."
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
