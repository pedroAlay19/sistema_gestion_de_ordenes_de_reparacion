import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { equipments } from "../../api";
import { equipmentTypes } from "../../data/equipmentTypes";
import { EquipmentType } from "../../types/equipment.types";

export default function EditEquipment() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    brand: "",
    model: "",
    serialNumber: "",
  });

  const loadEquipment = useCallback(async () => {
    if (!id) return;
    
    try {
      const equipment = await equipments.getById(id);
      setFormData({
        name: equipment.name,
        type: equipment.type,
        brand: equipment.brand,
        model: equipment.model,
        serialNumber: equipment.serialNumber || "",
      });
    } catch (error) {
      console.error("Error cargando equipo:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadEquipment();
  }, [loadEquipment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    try {
      await equipments.update(id, {
        type: formData.type as EquipmentType,
        brand: formData.brand,
        model: formData.model,
        serialNumber: formData.serialNumber || undefined,
        name: `${formData.brand} ${formData.model}`,
      });
      
      alert("Equipo actualizado correctamente");
      navigate(`/user/equipments/${id}`);
    } catch (error) {
      console.error("Error actualizando equipo:", error);
      alert("Error al actualizar el equipo");
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
      {/* Header */}
      <div className="bg-slate-800 px-8 py-6">
        <div className="max-w-3xl mx-auto">
          <Link
            to={`/user/equipments`}
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Volver a detalles
          </Link>
          <h1 className="text-3xl font-bold text-white">Editar Equipo</h1>
          <p className="text-slate-300 mt-1">
            Actualiza la información del equipo
          </p>
        </div>
      </div>

      <div className="p-8 bg-gray-100 min-h-screen">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Información del Equipo
            </h2>

            {/* Tipo de Equipo */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Tipo de Equipo <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-5 gap-3">
                {equipmentTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, type: type.value })
                    }
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                      formData.type === type.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className={
                        formData.type === type.value
                          ? "text-blue-600"
                          : "text-gray-400"
                      }
                    >
                      {type.icon}
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        formData.type === type.value
                          ? "text-blue-600"
                          : "text-gray-600"
                      }`}
                    >
                      {type.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Marca */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Marca <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.brand}
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: HP, Dell, Lenovo"
              />
            </div>

            {/* Modelo */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Modelo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.model}
                onChange={(e) =>
                  setFormData({ ...formData, model: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: Pavilion 15, Optiplex 7090"
              />
            </div>

            {/* Número de Serie */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Número de Serie
              </label>
              <input
                type="text"
                value={formData.serialNumber}
                onChange={(e) =>
                  setFormData({ ...formData, serialNumber: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Número de serie del equipo"
              />
            </div>

            {/* Botones */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={!formData.type || !formData.brand || !formData.model}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Guardar Cambios
              </button>
              <button
                type="button"
                onClick={() => navigate(`/user/equipments/${id}`)}
                className="px-8 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
