import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { equipments } from "../../api";
import type { CreateEquipmentDto, EquipmentType } from "../../types/equipment.types";
import { equipmentTypes } from "../../data/equipmentTypes";
import { XMarkIcon } from "@heroicons/react/24/outline";


export default function NewEquipment() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateEquipmentDto & { serialNumber: string }>({
    name: "",
    type: "" as EquipmentType,
    brand: "",
    model: "",
    serialNumber: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('=== INICIANDO CREACIÓN DE EQUIPO ===');
    console.log('FormData:', formData);
    
    try {
      const dataToSubmit = {
        name: `${formData.brand} ${formData.model}`,
        type: formData.type,
        brand: formData.brand,
        model: formData.model,
        serialNumber: formData.serialNumber || undefined,
      };
      
      console.log('Data a enviar:', dataToSubmit);
      console.log('Token disponible:', !!localStorage.getItem('access_token'));
      
      const result = await equipments.create(dataToSubmit);
      console.log('✅ Equipo creado exitosamente:', result);
      
      alert('Equipo registrado correctamente');
      navigate("/user/equipments");
    } catch (error) {
      console.error("❌ ERROR al crear equipo:", error);
      console.error('Error completo:', JSON.stringify(error, null, 2));
      
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      alert(`Error al registrar el equipo: ${errorMessage}`);
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-slate-900 border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl  text-slate-300">
              Registrar Equipo
            </h1>
            <p className="text-sm text-gray-200 mt-2">Información básica</p>
          </div>
          <button
            onClick={() => navigate("/user/equipments")}
            className="text-gray-200 hover:text-gray-500 transition-colors"
          >
            <XMarkIcon className="w-8 h-8" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h2 className="text-2xl text-gray-900 mb-6">
            Información Básica
          </h2>

          {/* Equipment Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Tipo de Equipo <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-5 gap-3">
              {equipmentTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: type.value })}
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

          {/* Brand */}
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Model */}
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Serial Number */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Número de Serie
            </label>
            <input
              type="text"
              required
              value={formData.serialNumber}
              onChange={(e) =>
                setFormData({ ...formData, serialNumber: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={!formData.type || !formData.brand || !formData.model}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Registrar Equipo
          </button>
        </div>
      </form>
    </>
  );
}
