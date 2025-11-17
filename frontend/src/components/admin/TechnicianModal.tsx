import { useState, useEffect } from 'react';
import { X, User, Mail, Lock, Phone, MapPin, Wrench, Calendar, Shield, CheckCircle } from 'lucide-react';
import type { TechnicianUser, CreateTechnicianDto, UpdateTechnicianDto } from '../../types';

interface TechnicianModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (technician: CreateTechnicianDto | UpdateTechnicianDto) => Promise<void>;
  technician?: TechnicianUser;
  mode: 'create' | 'edit';
}

export const TechnicianModal = ({ isOpen, onClose, onSave, technician, mode }: TechnicianModalProps) => {
  const [formData, setFormData] = useState<CreateTechnicianDto>({
    name: '',
    email: '',
    password: '',
    lastName: '',
    phone: '',
    address: '',
    specialty: '',
    experienceYears: 0,
    isEvaluator: false,
    active: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (technician && mode === 'edit') {
      setFormData({
        name: technician.name,
        email: technician.email,
        password: '',
        lastName: technician.lastName || '',
        phone: technician.phone || '',
        address: technician.address || '',
        specialty: technician.specialty,
        experienceYears: technician.experienceYears || 0,
        isEvaluator: technician.isEvaluator || false,
        active: technician.active ?? true,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        lastName: '',
        phone: '',
        address: '',
        specialty: '',
        experienceYears: 0,
        isEvaluator: false,
        active: true,
      });
    }
    setError(null);
  }, [technician, mode, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'edit') {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, email, ...updateData } = formData;
        await onSave(updateData);
      } else {
        await onSave(formData);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el técnico');
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
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {mode === 'create' ? 'Nuevo Técnico' : 'Editar Técnico'}
                </h2>
                <p className="text-blue-100 text-xs">
                  {mode === 'create' ? 'Agrega un nuevo técnico al sistema' : 'Actualiza la información del técnico'}
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
            {/* Columna izquierda - Información Personal */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-white flex items-center gap-2 pb-2 border-b border-gray-700">
                <User className="w-4 h-4 text-blue-400" />
                Información Personal
              </h3>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Nombre *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Juan"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Apellido
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Pérez"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    required
                    disabled={mode === 'edit'}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="tecnico@ejemplo.com"
                  />
                </div>
                {mode === 'edit' && (
                  <p className="text-[10px] text-gray-500 mt-1">Email no modificable</p>
                )}
              </div>

              {mode === 'create' && (
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    Contraseña *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Mínimo 6 caracteres"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Teléfono
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="+593 99 123 4567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Dirección
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Av. Principal 123"
                  />
                </div>
              </div>
            </div>

            {/* Columna derecha - Información Profesional */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-white flex items-center gap-2 pb-2 border-b border-gray-700">
                <Wrench className="w-4 h-4 text-blue-400" />
                Información Profesional
              </h3>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Especialidad *
                </label>
                <div className="relative">
                  <Wrench className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    required
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Reparación de laptops"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Años de Experiencia
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="number"
                    min="0"
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: parseInt(e.target.value) || 0 })}
                    className="w-full pl-9 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Permisos y Estado - Versión compacta */}
              <div className="space-y-3 pt-2">
                <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                  <label className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${formData.isEvaluator ? 'bg-blue-500/20' : 'bg-gray-700'}`}>
                        <Shield className={`w-4 h-4 ${formData.isEvaluator ? 'text-blue-400' : 'text-gray-500'}`} />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-white">Evaluador</p>
                        <p className="text-[10px] text-gray-400">Evaluar órdenes</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.isEvaluator || false}
                      onChange={(e) => setFormData({ ...formData, isEvaluator: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-600 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 bg-gray-700 cursor-pointer"
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
                        <p className="text-xs font-medium text-white">Activo</p>
                        <p className="text-[10px] text-gray-400">Puede trabajar</p>
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
                  {mode === 'create' ? 'Crear Técnico' : 'Guardar Cambios'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
