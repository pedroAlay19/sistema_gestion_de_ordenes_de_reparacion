import { useState, useEffect } from 'react';
import { X, Wrench, FileText, DollarSign, CheckCircle, Clipboard, CheckSquare } from 'lucide-react';
import type { Service, CreateMaintenanceServiceDto, UpdateMaintenanceServiceDto } from '../../types/service.types';
import { EquipmentType } from '../../types/equipment.types';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (service: CreateMaintenanceServiceDto | UpdateMaintenanceServiceDto) => Promise<void>;
  service?: Service;
  mode: 'create' | 'edit';
}

export const ServiceModal = ({ isOpen, onClose, onSave, service, mode }: ServiceModalProps) => {
  const [formData, setFormData] = useState<CreateMaintenanceServiceDto>({
    serviceName: '',
    description: '',
    basePrice: 0,
    applicableEquipmentTypes: [],
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (service && mode === 'edit') {
      setFormData({
        serviceName: service.serviceName,
        description: service.description,
        basePrice: service.basePrice,
        applicableEquipmentTypes: service.applicableEquipmentTypes,
        notes: service.notes,
      });
    } else {
      setFormData({
        serviceName: '',
        description: '',
        basePrice: 0,
        applicableEquipmentTypes: [],
        notes: '',
      });
    }
    setError(null);
  }, [service, mode, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el servicio');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const toggleEquipmentType = (type: EquipmentType) => {
    const currentTypes = formData.applicableEquipmentTypes || [];
    if (currentTypes.includes(type)) {
      setFormData({
        ...formData,
        applicableEquipmentTypes: currentTypes.filter(t => t !== type)
      });
    } else {
      setFormData({
        ...formData,
        applicableEquipmentTypes: [...currentTypes, type]
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl w-full max-w-4xl border border-gray-800 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center">
              <Wrench className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                {mode === 'create' ? 'Nuevo Servicio' : 'Editar Servicio'}
              </h2>
              <p className="text-xs text-gray-500">
                {mode === 'create' ? 'Agrega un nuevo servicio al catálogo' : 'Actualiza la información del servicio'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg flex items-center gap-2">
                <X className="w-5 h-5" />
                {error}
              </div>
            )}

            {/* Grid de dos columnas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Columna izquierda - Información Básica */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2 pb-2 border-b border-gray-800">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  Información Básica
                </h3>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">
                    Nombre del Servicio *
                  </label>
                  <div className="relative">
                    <Wrench className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      required
                      value={formData.serviceName}
                      onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                      className="w-full pl-10 pr-3 py-2.5 bg-gray-950 border border-gray-800 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                      placeholder="Ej: Cambio de pantalla"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">
                    Descripción *
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full pl-10 pr-3 py-2.5 bg-gray-950 border border-gray-800 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all resize-none"
                      placeholder="Descripción detallada del servicio"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">
                    Precio Base (USD) *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.basePrice}
                      onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) })}
                      className="w-full pl-10 pr-3 py-2.5 bg-gray-950 border border-gray-800 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              {/* Columna derecha - Detalles y Configuración */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2 pb-2 border-b border-gray-800">
                  <CheckSquare className="w-4 h-4 text-emerald-400" />
                  Tipos de Equipo Aplicables
                </h3>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-3">
                    Selecciona los tipos de equipo *
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto p-2 bg-gray-950 border border-gray-800 rounded-lg">
                    {Object.values(EquipmentType).map((type) => {
                      const isSelected = formData.applicableEquipmentTypes.includes(type);
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => toggleEquipmentType(type)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-left ${
                            isSelected
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                              : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-700'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                            isSelected
                              ? 'bg-emerald-500 border-emerald-500'
                              : 'border-gray-700'
                          }`}>
                            {isSelected && (
                              <CheckCircle className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <span className="text-xs font-medium">
                            {type.replace(/_/g, ' ')}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">
                    Notas Internas
                  </label>
                  <div className="relative">
                    <Clipboard className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <textarea
                      value={formData.notes || ''}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                      className="w-full pl-10 pr-3 py-2.5 bg-gray-950 border border-gray-800 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all resize-none"
                      placeholder="Notas opcionales para uso interno"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm text-gray-400 bg-gray-950 border border-gray-800 rounded-lg hover:bg-gray-800 hover:text-white transition-all disabled:opacity-50 font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || formData.applicableEquipmentTypes.length === 0}
              className="px-4 py-2 text-sm bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-all disabled:opacity-50 font-medium flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  {mode === 'create' ? 'Crear Servicio' : 'Guardar Cambios'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
