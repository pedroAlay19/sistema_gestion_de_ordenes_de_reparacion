import {
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  PrinterIcon,
  DeviceTabletIcon,
  TrashIcon,
  PencilSquareIcon,
  ClockIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import type { Equipment } from "../../types/equipment.types";
import { EquipmentStatus } from "../../types/equipment.types";

interface EquipmentCardProps {
  equipment: Equipment;
  onDelete: (id: string, name: string) => void;
  onRequestRepair: (equipmentId: string) => void;
  onViewDetails: (equipmentId: string) => void;
  onEdit: (equipmentId: string) => void;
}

const getEquipmentIcon = (type: string) => {
  const iconClass = "w-8 h-8";
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
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 8 8">
            <circle cx="4" cy="4" r="3" />
          </svg>
          Disponible
        </span>
      );
    case EquipmentStatus.IN_REPAIR:
      return (
        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 8 8">
            <circle cx="4" cy="4" r="3" />
          </svg>
          En Reparación
        </span>
      );
    case EquipmentStatus.RETIRED:
      return (
        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium flex items-center gap-1">
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

export default function EquipmentCard({
  equipment,
  onDelete,
  onRequestRepair,
  onViewDetails,
  onEdit,
}: EquipmentCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Header oscuro con icono */}
      <div className="bg-slate-800 p-6 relative">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center text-white">
              {getEquipmentIcon(equipment.type)}
            </div>
            <div className="text-white">
              <h3 className="text-lg font-semibold">{equipment.name}</h3>
              <p className="text-sm text-slate-300">{equipment.type}</p>
            </div>
          </div>
          <div className="absolute top-4 right-4">
            {getStatusBadge(equipment.currentStatus)}
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6 bg-gray-50">
        <div className="space-y-3 mb-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Marca</p>
            <p className="text-sm font-medium text-gray-900">{equipment.brand}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Modelo</p>
            <p className="text-sm font-medium text-gray-900">{equipment.model}</p>
          </div>
          {equipment.serialNumber && (
            <div>
              <p className="text-xs text-gray-500 mb-1">S/N</p>
              <p className="text-sm font-mono text-gray-900">
                {equipment.serialNumber}
              </p>
            </div>
          )}
        </div>

        {/* Botón Ver Detalles */}
        <button 
          onClick={() => onViewDetails(equipment.id)}
          className="w-full bg-white border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors mb-3 flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Ver Detalles
        </button>

        {/* Acciones */}
        <div className="flex gap-2 mb-3">
          <button 
            onClick={() => onEdit(equipment.id)}
            className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
          >
            <PencilSquareIcon className="w-4 h-4" />
            Editar
          </button>
          <button className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5">
            <ClockIcon className="w-4 h-4" />
            Historial
          </button>
        </div>

        {/* Nueva Orden */}
        <button
          onClick={() => onRequestRepair(equipment.id)}
          className="w-full bg-slate-800 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-slate-900 transition-colors flex items-center justify-center gap-2"
        >
          <PlusCircleIcon className="w-5 h-5" />
          Nueva Orden
        </button>

        {/* Eliminar */}
        <button
          onClick={() => onDelete(equipment.id, equipment.name)}
          className="w-full mt-2 text-red-600 py-2 text-sm font-medium hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <TrashIcon className="w-4 h-4" />
          Eliminar
        </button>
      </div>
    </div>
  );
}
