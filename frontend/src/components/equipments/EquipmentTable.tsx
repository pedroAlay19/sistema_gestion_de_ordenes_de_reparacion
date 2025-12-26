import {
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  PrinterIcon,
  DeviceTabletIcon,
  PencilSquareIcon,
  ClockIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import type { Equipment } from "../../types/equipment.types";
import { EquipmentStatus } from "../../types/equipment.types";

interface EquipmentTableProps {
  equipments: Equipment[];
  onDelete: (id: string, name: string) => void;
  onRequestRepair: (equipmentId: string) => void;
  onEdit: (equipmentId: string) => void;
  onViewHistory?: (equipment: Equipment) => void;
}

const getEquipmentIcon = (type: string) => {
  const iconClass = "w-6 h-6";
  switch (type.toUpperCase()) {
    case "LAPTOP":
    case "PC":
      return <ComputerDesktopIcon className={iconClass} />;
    case "CELLPHONE":
      return <DevicePhoneMobileIcon className={iconClass} />;
    case "PRINTER":
      return <PrinterIcon className={iconClass} />;
    case "TABLET":
      return <DeviceTabletIcon className={iconClass} />;
    default:
      return <DevicePhoneMobileIcon className={iconClass} />;
  }
};

const getStatusBadge = (status: EquipmentStatus) => {
  switch (status) {
    case EquipmentStatus.AVAILABLE:
      return (
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium inline-flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 8 8">
            <circle cx="4" cy="4" r="3" />
          </svg>
          Disponible
        </span>
      );
    case EquipmentStatus.IN_REPAIR:
      return (
        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium inline-flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 8 8">
            <circle cx="4" cy="4" r="3" />
          </svg>
          En Reparación
        </span>
      );
    case EquipmentStatus.RETIRED:
      return (
        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium inline-flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 8 8">
            <circle cx="4" cy="4" r="3" />
          </svg>
          Retirado
        </span>
      );
    default:
      return null;
  }
};

export default function EquipmentTable({
  equipments,
  onDelete,
  onRequestRepair,
  onEdit,
  onViewHistory,
}: EquipmentTableProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Equipo
              </th>
              <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Marca/Modelo
              </th>
              <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Serial
              </th>
              <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="text-right py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {equipments.map((equipment) => (
              <tr
                key={equipment.id}
                className="hover:bg-gray-50 transition-colors"
              >
                {/* Equipo */}
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-white shrink-0">
                      {getEquipmentIcon(equipment.type)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {equipment.name}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Tipo */}
                <td className="py-4 px-6">
                  <p className="text-sm text-gray-700">{equipment.type}</p>
                </td>

                {/* Marca/Modelo */}
                <td className="py-4 px-6">
                  <p className="text-sm text-gray-900 font-medium">
                    {equipment.brand}
                  </p>
                  <p className="text-xs text-gray-500">{equipment.model}</p>
                </td>

                {/* Serial */}
                <td className="py-4 px-6">
                  <p className="text-sm font-mono text-gray-700">
                    {equipment.serialNumber || "-"}
                  </p>
                </td>

                {/* Estado */}
                <td className="py-4 px-6">
                  {getStatusBadge(equipment.currentStatus)}
                </td>

                {/* Acciones */}
                <td className="py-4 px-6">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onEdit(equipment.id)}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <PencilSquareIcon className="w-5 h-5" />
                    </button>
                    {onViewHistory && (
                      <button
                        onClick={() => onViewHistory(equipment)}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Historial"
                      >
                        <ClockIcon className="w-5 h-5" />
                      </button>
                    )}
                    {/* Solo mostrar botón de nueva orden si el equipo está disponible */}
                    {equipment.currentStatus === EquipmentStatus.AVAILABLE && (
                      <button
                        onClick={() => onRequestRepair(equipment.id)}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Nueva orden"
                      >
                        <PlusCircleIcon className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(equipment.id, equipment.name)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
