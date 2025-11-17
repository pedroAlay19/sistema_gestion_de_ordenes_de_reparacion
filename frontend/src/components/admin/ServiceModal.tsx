import { useState, useEffect } from 'react';
import { X, Wrench, FileText, DollarSign, Clock, Tag, CheckCircle, Clipboard } from 'lucide-react';
import type { Service, CreateMaintenanceServiceDto, UpdateMaintenanceServiceDto } from '../../types';
import { ServiceType } from '../../types';

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
    estimatedTimeMinutes: undefined,
    requiresParts: false,
    type: ServiceType.REPAIR,
    imageUrls: [],
    active: true,
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
        estimatedTimeMinutes: service.estimatedTimeMinutes,
        requiresParts: service.requiresParts,
        type: service.type,
        imageUrls: service.imageUrls || [],
        active: service.active,
        notes: service.notes,
      });
    } else {
      setFormData({
        serviceName: '',
        description: '',
        basePrice: 0,
        estimatedTimeMinutes: undefined,
        requiresParts: false,
        type: ServiceType.REPAIR,
        imageUrls: [],
        active: true,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-linear-to-br from-black/40 via-black/50 to-black/40 p-4">
      <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-5xl border border-gray-700">
        {/* Header with gradient */}
        <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {mode === 'create' ? 'Nuevo Servicio' : 'Editar Servicio'}
                </h2>
                <p className="text-blue-100 text-xs">
                  {mode === 'create' ? 'Agrega un nuevo servicio al catálogo' : 'Actualiza la información del servicio'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
              disabled={loading}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg flex items-center gap-2">
              <X className="w-5 h-5" />
              {error}
            </div>
          )}

          {/* Grid de dos columnas */}
          <div className="grid grid-cols-2 gap-6">
            {/* Columna izquierda - Información Básica */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-white flex items-center gap-2 pb-2 border-b border-gray-700">
                <FileText className="w-4 h-4 text-blue-400" />
                Información Básica
              </h3>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Nombre del Servicio *
                </label>
                <div className="relative">
                  <Wrench className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    required
                    value={formData.serviceName}
                    onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Ej: Cambio de pantalla"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Descripción *
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full pl-9 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Descripción detallada del servicio"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Tipo de Servicio *
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as ServiceType })}
                    className="w-full pl-9 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value={ServiceType.REPAIR}>Reparación</option>
                    <option value={ServiceType.MAINTENANCE}>Mantenimiento</option>
                    <option value={ServiceType.INSTALLATION}>Instalación</option>
                    <option value={ServiceType.DATA}>Recuperación de Datos</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Columna derecha - Detalles y Configuración */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-white flex items-center gap-2 pb-2 border-b border-gray-700">
                <DollarSign className="w-4 h-4 text-blue-400" />
                Detalles y Configuración
              </h3>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
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
                    className="w-full pl-9 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Tiempo Estimado (minutos)
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="number"
                    min="0"
                    value={formData.estimatedTimeMinutes || ''}
                    onChange={(e) => setFormData({ ...formData, estimatedTimeMinutes: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="w-full pl-9 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Notas Internas
                </label>
                <div className="relative">
                  <Clipboard className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                  <textarea
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full pl-9 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Notas opcionales"
                  />
                </div>
              </div>

              {/* Checkboxes compactos */}
              <div className="space-y-3 pt-2">
                <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                  <label className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${formData.requiresParts ? 'bg-purple-500/20' : 'bg-gray-700'}`}>
                        <Wrench className={`w-4 h-4 ${formData.requiresParts ? 'text-purple-400' : 'text-gray-500'}`} />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-white">Requiere Repuestos</p>
                        <p className="text-[10px] text-gray-400">Necesita piezas</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.requiresParts || false}
                      onChange={(e) => setFormData({ ...formData, requiresParts: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-600 text-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 bg-gray-700 cursor-pointer"
                    />
                  </label>
                </div>

                <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                  <label className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${formData.active ? 'bg-green-500/20' : 'bg-gray-700'}`}>
                        <CheckCircle className={`w-4 h-4 ${formData.active ? 'text-green-400' : 'text-gray-500'}`} />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-white">Servicio Activo</p>
                        <p className="text-[10px] text-gray-400">Disponible para ofrecer</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.active ?? true}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-600 text-green-500 focus:ring-2 focus:ring-green-500 focus:ring-offset-0 bg-gray-700 cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex justify-end gap-3 pt-5 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2 text-sm text-gray-300 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all disabled:opacity-50 font-medium border border-gray-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 font-medium shadow-lg shadow-blue-500/20 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
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
