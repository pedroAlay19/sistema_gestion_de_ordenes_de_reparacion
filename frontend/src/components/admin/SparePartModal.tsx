import { useState, useEffect } from 'react';
import { X, Package, FileText, DollarSign, Hash, CheckCircle } from 'lucide-react';
import type { SparePart, CreateSparePartDto, UpdateSparePartDto } from '../../types/spare-part.types';

interface SparePartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sparePart: CreateSparePartDto | UpdateSparePartDto) => Promise<void>;
  sparePart?: SparePart;
  mode: 'create' | 'edit';
}

export const SparePartModal = ({ isOpen, onClose, onSave, sparePart, mode }: SparePartModalProps) => {
  const [formData, setFormData] = useState<CreateSparePartDto>({
    name: '',
    description: '',
    stock: 0,
    unitPrice: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sparePart && mode === 'edit') {
      setFormData({
        name: sparePart.name,
        description: sparePart.description,
        stock: sparePart.stock,
        unitPrice: sparePart.unitPrice,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        stock: 0,
        unitPrice: 0,
      });
    }
    setError(null);
  }, [sparePart, mode, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el repuesto');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl w-full max-w-4xl border border-gray-800 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                {mode === 'create' ? 'Nuevo Repuesto' : 'Editar Repuesto'}
              </h2>
              <p className="text-xs text-gray-500">
                {mode === 'create' ? 'Agrega un nuevo repuesto al inventario' : 'Actualiza la información del repuesto'}
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
              {/* Columna izquierda - Información del Producto */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2 pb-2 border-b border-gray-800">
                  <FileText className="w-4 h-4 text-blue-400" />
                  Información del Producto
                </h3>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">
                    Nombre del Repuesto *
                  </label>
                  <div className="relative">
                    <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-3 py-2.5 bg-gray-950 border border-gray-800 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                      placeholder="Ej: SSD 500GB Kingston"
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
                      rows={5}
                      className="w-full pl-10 pr-3 py-2.5 bg-gray-950 border border-gray-800 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all resize-none"
                      placeholder="Descripción detallada del repuesto..."
                    />
                  </div>
                </div>
              </div>

              {/* Columna derecha - Inventario y Precio */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2 pb-2 border-b border-gray-800">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  Inventario y Precio
                </h3>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">
                    Stock Disponible *
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                      className="w-full pl-10 pr-3 py-2.5 bg-gray-950 border border-gray-800 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                      placeholder="0"
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1.5">
                    {formData.stock === 0 && '⚠️ Sin stock'} 
                    {formData.stock > 0 && formData.stock < 5 && '🔥 Stock bajo'}
                    {formData.stock >= 5 && formData.stock < 10 && '⚡ Stock normal'}
                    {formData.stock >= 10 && '✅ Stock alto'}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">
                    Precio Unitario (USD) *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.unitPrice}
                      onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })}
                      className="w-full pl-10 pr-3 py-2.5 bg-gray-950 border border-gray-800 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Resumen de valor */}
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-800 mt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">Precio Unitario:</span>
                      <span className="text-sm text-white font-medium">${formData.unitPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">Cantidad:</span>
                      <span className="text-sm text-white font-medium">{formData.stock} unidades</span>
                    </div>
                    <div className="h-px bg-gray-800 my-2"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300 font-medium">Valor Total:</span>
                      <span className="text-lg text-emerald-400 font-bold">
                        ${(formData.unitPrice * formData.stock).toFixed(2)}
                      </span>
                    </div>
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
              disabled={loading}
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
                  {mode === 'create' ? 'Crear Repuesto' : 'Guardar Cambios'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
