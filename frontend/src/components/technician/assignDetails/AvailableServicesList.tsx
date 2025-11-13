import { CheckCircleIcon } from "@heroicons/react/24/outline";
import type { MaintenanceService } from "../../../types";

interface AvailableServicesListProps {
  services: MaintenanceService[];
  selectedServiceIds: string[];
  onSelectService: (service: MaintenanceService) => void;
}

export function AvailableServicesList({
  services,
  selectedServiceIds,
  onSelectService,
}: AvailableServicesListProps) {
  return (
    <div>
      <p className="text-sm font-semibold text-gray-700 mb-2">Servicios Disponibles</p>
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {services.map((service) => {
          const isSelected = selectedServiceIds.includes(service.id);
          return (
            <button
              key={service.id}
              onClick={() => !isSelected && onSelectService(service)}
              disabled={isSelected}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                isSelected
                  ? "bg-green-50 border-green-300 cursor-not-allowed"
                  : "bg-white border-gray-200 hover:border-blue-400 hover:bg-blue-50"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900 text-sm flex items-center gap-2">
                    {service.serviceName}
                    {isSelected && <CheckCircleIcon className="w-4 h-4 text-green-600" />}
                  </h5>
                  <p className="text-xs text-gray-600 mt-1">{service.description}</p>
                  <p className="text-xs font-semibold text-blue-600 mt-1">
                    ${Number(service.basePrice).toFixed(2)}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
