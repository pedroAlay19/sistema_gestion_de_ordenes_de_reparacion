import { useState } from "react";
import { Link } from "react-router-dom";
import { ClockIcon } from "@heroicons/react/24/outline";
import type { RepairOrder } from "../../types/repair-order.types";
import { equipmentTypes } from "../../data/equipmentTypes";
import { ImageGalleryModal } from "../ui/ImageGalleryModal";
import { RepairOrderDiagnosis } from "./RepairOrderDiagnosis";

export const SideBar: React.FC<{ order: RepairOrder; showHistoryButton?: boolean }> = ({ order, showHistoryButton = true }) => {
  const [showGallery, setShowGallery] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const equipmentType = equipmentTypes.find(
    (e) => e.value === order.equipment?.type
  );

  const openGallery = (index: number) => {
    setSelectedImageIndex(index);
    setShowGallery(true);
  };

  // Validar que equipment existe
  if (!order.equipment) {
    return (
      <aside className="space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <p className="text-yellow-800 text-sm">
            Cargando información del equipo...
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="space-y-6">
      {/* Equipment Info */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
              {equipmentType?.icon}
            </div>
            <div>
              <h3 className="text-xl text-white">Equipo</h3>
              <p className="text-slate-300 text-sm mt-0.5">
                Información del dispositivo
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Nombre
            </p>
            <p className="text-lg text-gray-900">
              {order.equipment.name}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Tipo
            </p>
            <p className="text-lg text-gray-900">
              {order.equipment.type}
            </p>
          </div>
          {order.equipment.serialNumber && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Número de Serie
              </p>
              <p className="text-base font-mono text-gray-900">
                {order.equipment.serialNumber}
              </p>
            </div>
          )}
        </div>

        {/* View History Button */}
        {showHistoryButton && (
          <div className="px-6 pb-6">
            <Link
              to={`/technician/equipments/${order.equipment.id}/history`}
              className="flex items-center justify-center gap-2 w-full bg-slate-900 hover:bg-slate-800 text-white px-4 py-3 rounded-xl font-medium transition-colors shadow-sm"
            >
              <ClockIcon className="w-5 h-5" />
              Ver Historial del Equipo
            </Link>
          </div>
        )}
      </div>

      {/* Problem */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-xl text-white">
                Problema Reportado
              </h3>
              <p className="text-slate-300 text-sm mt-0.5">
                Descripción del cliente
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-4">
            <p className="text-gray-900 leading-relaxed">
              {order.problemDescription}
            </p>
          </div>

          {/* Problem Images */}
          {order.imageUrls && order.imageUrls.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Imágenes del Problema
              </p>
              <div className="grid grid-cols-2 gap-2">
                {order.imageUrls.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => openGallery(index)}
                    className="group relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 hover:border-slate-900 transition-all cursor-pointer"
                  >
                    <img
                      src={url}
                      alt={`Imagen del problema ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">
                        Ver imagen
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image Gallery Modal */}
      {showGallery && order.imageUrls && (
        <ImageGalleryModal
          images={order.imageUrls}
          initialIndex={selectedImageIndex}
          onClose={() => setShowGallery(false)}
        />
      )}

      {/* Diagnosis */}
      {order.diagnosis && (
        <RepairOrderDiagnosis 
          diagnosis={order.diagnosis} 
          estimatedCost={order.estimatedCost}
        />
      )}

      {/* Warranty */}
      {order.warrantyStartDate && order.warrantyEndDate && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-500 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Garantía</h3>
                <p className="text-green-50 text-sm mt-0.5">
                  Cobertura incluida
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-sm text-gray-700 mb-4 font-medium">
              Esta reparación incluye garantía de servicio
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">
                  Inicio
                </p>
                <p className="text-lg font-bold text-green-900">
                  {new Date(order.warrantyStartDate).toLocaleDateString(
                    "es-ES"
                  )}
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">
                  Vencimiento
                </p>
                <p className="text-lg font-bold text-green-900">
                  {new Date(order.warrantyEndDate).toLocaleDateString("es-ES")}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
