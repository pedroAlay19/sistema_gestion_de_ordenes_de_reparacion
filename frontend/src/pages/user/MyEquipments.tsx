import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEquipments, deleteEquipment } from '../../api/api';
import type { Equipment } from '../../types/equipment.types';

// Iconos por tipo de equipo
const getEquipmentIcon = (type: string) => {
  switch (type.toUpperCase()) {
    case 'LAPTOP':
      return '💻';
    case 'DESKTOP':
      return '🖥️';
    case 'PRINTER':
      return '🖨️';
    case 'SCANNER':
      return '📠';
    default:
      return '📱';
  }
};

export default function MyEquipments() {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEquipments();
  }, []);

  const loadEquipments = async () => {
    try {
      const data = await getEquipments();
      setEquipments(data);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar ${name}?`)) return;
    
    try {
      await deleteEquipment(id);
      setEquipments(equipments.filter(e => e.id !== id));
    } catch {
      alert('Error al eliminar');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-900 text-xl font-medium">Cargando...</div>
      </div>
    );
  }

  return (
    <>
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Mis Equipos</h1>
            <p className="text-gray-600">Gestión visual de tus dispositivos</p>
          </div>
          <Link
            to="/user/equipments/new"
            className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Agregar Equipo
          </Link>
        </div>
      </div>

      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {equipments.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-5xl">💻</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No tienes equipos registrados</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Comienza agregando tu primer equipo para poder solicitar reparaciones y dar seguimiento
              </p>
              <Link
                to="/user/equipments/new"
                className="inline-block bg-black text-white px-8 py-4 rounded-lg font-medium hover:bg-gray-900 transition-colors"
              >
                Agregar mi primer equipo
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {equipments.map((equipment) => (
                <div
                  key={equipment.id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all group"
                >
                  {/* Header con icono grande */}
                  <div className="bg-linear-to-br from-gray-900 to-gray-700 p-8 text-center">
                    <div className="text-6xl mb-3">
                      {getEquipmentIcon(equipment.type)}
                    </div>
                    <h3 className="text-white font-bold text-xl mb-1">{equipment.name}</h3>
                    <p className="text-white/70 text-sm">{equipment.type}</p>
                  </div>

                  {/* Información */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">Marca y Modelo</p>
                        <p className="text-sm font-medium text-gray-900">{equipment.brand} {equipment.model}</p>
                      </div>
                    </div>

                    {equipment.serialNumber && (
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                        </svg>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 mb-1">Número de Serie</p>
                          <p className="text-sm font-medium text-gray-900 font-mono">{equipment.serialNumber}</p>
                        </div>
                      </div>
                    )}

                    {equipment.observations && (
                      <div className="pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">Observaciones</p>
                        <p className="text-sm text-gray-700 line-clamp-2">{equipment.observations}</p>
                      </div>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="px-6 pb-6 flex gap-3">
                    <Link
                      to="/user/repair-orders/new"
                      state={{ equipmentId: equipment.id }}
                      className="flex-1 bg-black text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors text-center"
                    >
                      Solicitar Reparación
                    </Link>
                    <button
                      onClick={() => handleDelete(equipment.id, equipment.name)}
                      className="px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
