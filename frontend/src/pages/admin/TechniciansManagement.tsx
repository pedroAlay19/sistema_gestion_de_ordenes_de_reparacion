import { useState, useEffect } from "react";
import {
  PlusIcon,
  UserIcon,
  PencilIcon,
  TrashIcon,
  ShieldCheckIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import type {
  CreateTechnicianDto,
  UpdateTechnicianDto,
} from "../../types/technician.types";
import type { Technician } from "../../types/technician.types";
import { TechnicianModal } from "../../components/admin/TechnicianModal";
import { users } from "../../api";
import { generateTechniciansPerformanceReport } from "../../api/reports";
import { downloadPdfFromBase64 } from "../../utils/pdfDownload";

export default function TechniciansManagement() {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState<
    Technician | undefined
  >();
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [generatingReport, setGeneratingReport] = useState(false);

  useEffect(() => {
    const loadTechnicians = async () => {
      try {
        setLoading(true);
        const data = await users.findTechnicians();
        setTechnicians(data);
      } catch (error) {
        console.error("Error loading technicians:", error);
      } finally {
        setLoading(false);
      }
    };
    loadTechnicians();
  }, []);

  const handleOpenCreateModal = () => {
    setSelectedTechnician(undefined);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (technician: Technician) => {
    setSelectedTechnician(technician);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Está seguro de eliminar este técnico?")) return;

    try {
      await users.remove(id);
      setTechnicians(technicians.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error deleting technician:", error);
      alert("Error al eliminar el técnico");
    }
  };

  const handleToggleActive = async (technician: Technician) => {
    try {
      const updatedTechnician = await users.updateTechnician(technician.id, {
        active: !technician.active,
      });
      setTechnicians(
        technicians.map((t) =>
          t.id === updatedTechnician.id ? updatedTechnician : t
        )
      );
    } catch (error) {
      console.error("Error updating technician:", error);
      alert("Error al actualizar el técnico");
    }
  };

  const handleToggleEvaluator = async (technician: Technician) => {
    try {
      const updatedTechnician = await users.updateTechnician(technician.id, {
        isEvaluator: !technician.isEvaluator,
      });
      setTechnicians(
        technicians.map((t) =>
          t.id === updatedTechnician.id ? updatedTechnician : t
        )
      );
    } catch (error) {
      console.error("Error updating technician:", error);
      alert("Error al actualizar el técnico");
    }
  };

  const handleSaveTechnician = async (
    technicianData: CreateTechnicianDto | UpdateTechnicianDto
  ) => {
    if (modalMode === "create") {
      const newTechnician = await users.createTechnician(
        technicianData as CreateTechnicianDto
      );
      setTechnicians([...technicians, newTechnician]);
    } else if (selectedTechnician) {
      const updatedTechnician = await users.updateTechnician(
        selectedTechnician.id,
        technicianData as UpdateTechnicianDto
      );
      setTechnicians(
        technicians.map((t) =>
          t.id === updatedTechnician.id ? updatedTechnician : t
        )
      );
    }
  };

  const handleGeneratePerformanceReport = async () => {
    try {
      console.log('Generando reporte de rendimiento de técnicos...');
      setGeneratingReport(true);

      const base64Pdf = await generateTechniciansPerformanceReport();
      downloadPdfFromBase64(base64Pdf, 'reporte-rendimiento-tecnicos.pdf');
      console.log('Reporte generado exitosamente');

    } catch (error: any) {
      console.error("Error al generar reporte:", error);
      const errorMessage = error?.message || "Error desconocido al generar el reporte";
      alert(`Error al generar el reporte:\n${errorMessage}`);
    } finally {
      setGeneratingReport(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Técnicos</h1>
            <p className="text-gray-400">
              Gestión de {technicians.length} técnicos del sistema
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleGeneratePerformanceReport}
              disabled={generatingReport}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 hover:bg-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Descargar reporte de rendimiento"
            >
              {generatingReport ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-400 border-t-transparent"></div>
                  <span className="text-sm font-medium">Generando...</span>
                </>
              ) : (
                <>
                  <ChartBarIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">Reporte</span>
                </>
              )}
            </button>
            <button
              onClick={handleOpenCreateModal}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 hover:bg-blue-500/20 transition-all"
            >
              <PlusIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Nuevo Técnico</span>
            </button>
          </div>
        </div>

        {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-32 bg-gray-900/50 border border-gray-800 rounded-lg">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Cargando técnicos...</p>
          </div>
        </div>
      ) : (
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-6 py-4 text-left">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Técnico
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Especialidad
                    </span>
                  </th>
                  <th className="px-6 py-4 text-center">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Evaluador
                    </span>
                  </th>
                  <th className="px-6 py-4 text-center">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Estado
                    </span>
                  </th>
                  <th className="px-6 py-4 text-right">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Acciones
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                  {technicians.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
                            <UserIcon className="w-8 h-8 text-gray-600" />
                          </div>
                          <p className="text-gray-500 font-medium">No se encontraron técnicos</p>
                          <p className="text-sm text-gray-600">Intenta con otro término de búsqueda</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    technicians.map((tech) => (
                      <tr
                        key={tech.id}
                        className="hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                              <UserIcon className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-white">
                                {tech.name}
                              </div>
                              <div className="text-xs text-gray-400">
                                {tech.email}
                              </div>
                              <div className="text-xs text-gray-500">
                                {tech.phone || "-"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-300">{tech.specialty || "-"}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => handleToggleEvaluator(tech)}
                            className={`p-2 rounded-lg transition-all ${
                              tech.isEvaluator
                                ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'
                                : 'bg-gray-800 text-gray-500 hover:bg-gray-700'
                            }`}
                            title={tech.isEvaluator ? 'Es evaluador' : 'No es evaluador'}
                          >
                            <ShieldCheckIcon className="h-5 w-5" />
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => handleToggleActive(tech)}
                            className={`px-3 py-1.5 inline-flex text-xs font-semibold rounded-lg transition-all ${
                              tech.active
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}
                          >
                            {tech.active ? 'Activo' : 'Inactivo'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditModal(tech)}
                              className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                              title="Editar técnico"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(tech.id)}
                              className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                              title="Eliminar técnico"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <TechnicianModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTechnician}
        technician={selectedTechnician}
        mode={modalMode}
      />
    </div>
  );
}
