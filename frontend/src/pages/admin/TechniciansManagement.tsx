import { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  UserIcon,
  PencilIcon,
  TrashIcon,
  ShieldCheckIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import type {
  TechnicianUser,
  CreateTechnicianDto,
  UpdateTechnicianDto,
} from "../../types";
import { TechnicianModal } from "../../components/admin/TechnicianModal";
import { createTechnician, deleteTechnician, getAllTechnicians, updateTechnician } from "../../api";

export default function TechniciansManagement() {
  const [technicians, setTechnicians] = useState<TechnicianUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState<
    TechnicianUser | undefined
  >();
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const loadTechnicians = async () => {
      try {
        setLoading(true);
        const data = await getAllTechnicians();
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

  const handleOpenEditModal = (technician: TechnicianUser) => {
    setSelectedTechnician(technician);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Está seguro de eliminar este técnico?")) return;

    try {
      await deleteTechnician(id);
      setTechnicians(technicians.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error deleting technician:", error);
      alert("Error al eliminar el técnico");
    }
  };

  const handleToggleActive = async (technician: TechnicianUser) => {
    try {
      const updatedTechnician = await updateTechnician(technician.id, {
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

  const handleToggleEvaluator = async (technician: TechnicianUser) => {
    try {
      const updatedTechnician = await updateTechnician(technician.id, {
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
      const newTechnician = await createTechnician(
        technicianData as CreateTechnicianDto
      );
      setTechnicians([...technicians, newTechnician]);
    } else if (selectedTechnician) {
      const updatedTechnician = await updateTechnician(
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

  const filteredTechnicians = technicians.filter(
    (tech) =>
      tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.specialty?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Técnicos</h1>
          <p className="text-gray-400 mt-1">Gestión de técnicos del sistema</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setSidebarCollapsed(!sidebarCollapsed);
              const sidebar = document.querySelector('.lg\\:fixed.lg\\:inset-y-0') as HTMLElement;
              const mainContent = document.querySelector('.lg\\:pl-64') as HTMLElement;
              if (sidebar && mainContent) {
                if (!sidebarCollapsed) {
                  sidebar.style.display = 'none';
                  mainContent.style.paddingLeft = '0';
                } else {
                  sidebar.style.display = 'flex';
                  mainContent.style.paddingLeft = '16rem';
                }
              }
            }}
            className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
          >
            <Bars3Icon className="w-5 h-5" />
            {sidebarCollapsed ? 'Mostrar' : 'Ocultar'} Menú
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            Nuevo Técnico
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Total Técnicos</p>
          <p className="text-2xl font-bold text-white mt-1">
            {technicians.length}
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Activos</p>
          <p className="text-2xl font-bold text-green-500 mt-1">
            {technicians.filter((t) => t.active).length}
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Inactivos</p>
          <p className="text-2xl font-bold text-red-500 mt-1">
            {technicians.filter((t) => !t.active).length}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o especialidad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Técnico
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Especialidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Experiencia
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Evaluador
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredTechnicians.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-gray-400"
                    >
                      No se encontraron técnicos
                    </td>
                  </tr>
                ) : (
                  filteredTechnicians.map((tech) => (
                    <tr
                      key={tech.id}
                      className="hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                            <UserIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-white font-medium">
                              {tech.name}
                            </div>
                            <div className="text-sm text-gray-400">
                              {tech.email}
                            </div>
                            <div className="text-sm text-gray-500">
                              {tech.phone || "-"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                        {tech.specialty || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                        {tech.experienceYears ? `${tech.experienceYears} años` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleToggleEvaluator(tech)}
                          className={`p-2 rounded-lg transition-all ${
                            tech.isEvaluator
                              ? 'bg-blue-900/50 text-blue-300 hover:bg-blue-900/70'
                              : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                          }`}
                          title={tech.isEvaluator ? 'Es evaluador' : 'No es evaluador'}
                        >
                          <ShieldCheckIcon className="h-5 w-5" />
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleToggleActive(tech)}
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full transition-all ${
                            tech.active
                              ? 'bg-green-900/50 text-green-300 hover:bg-green-900/70'
                              : 'bg-red-900/50 text-red-300 hover:bg-red-900/70'
                          }`}
                        >
                          {tech.active ? 'Activo' : 'Inactivo'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(tech)}
                            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded-lg transition-all"
                            title="Editar técnico"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(tech.id)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-all"
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
