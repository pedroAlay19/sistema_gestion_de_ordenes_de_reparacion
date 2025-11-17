import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";
import { getEquipments, deleteEquipment } from "../../api/api";
import { EquipmentCard, EquipmentTable } from "../../components/equipments";
import type { Equipment } from "../../types/equipment.types";
import { EquipmentStatus } from "../../types";

type ViewMode = "grid" | "list";
type FilterType = EquipmentStatus | "all";

export default function MyEquipments() {
  const navigate = useNavigate();
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  useEffect(() => {
    loadEquipments();
  }, []);

  const loadEquipments = async () => {
    setLoading(true);
    try {
      const data = await getEquipments();
      setEquipments(data);
    } catch (error) {
      console.error("Error cargando equipos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar ${name}?`)) return;

    try {
      await deleteEquipment(id);
      setEquipments(equipments.filter((e) => e.id !== id));
    } catch {
      alert("Error al eliminar");
    }
  };

  const handleRequestRepair = (equipmentId: string) => {
    navigate("/user/repair-orders/new", { state: { equipmentId } });
  };

  const handleViewDetails = (equipmentId: string) => {
    navigate(`/user/equipments/${equipmentId}`);
  };

  const handleEdit = (equipmentId: string) => {
    navigate(`/user/equipments/${equipmentId}/edit`);
  };

  const getFilteredEquipments = () => {
    let filtered = equipments;

    // Filtrar por status
    if (filter !== "all") {
      filtered = filtered.filter((eq) => eq.currentStatus === filter);
    }

    // Filtrar por búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (eq) =>
          eq.name.toLowerCase().includes(term) ||
          eq.brand.toLowerCase().includes(term) ||
          eq.model.toLowerCase().includes(term) ||
          eq.type.toLowerCase().includes(term) ||
          eq.serialNumber?.toLowerCase().includes(term)
      );
    }

    return filtered;
  };

  const filteredEquipments = getFilteredEquipments();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-900 text-xl font-medium">
          Cargando equipos...
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="bg-slate-900 border-b border-gray-800 px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Inventario de Equipos</h1>
            <p className="text-slate-300 mt-1">
              {equipments.length} dispositivo{equipments.length !== 1 ? 's' : ''} registrado{equipments.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => navigate("/user/equipments/new")}
            className="bg-gray-200 text-gray-800 px-5 py-3 rounded-lg font-medium hover:bg-pink-300 transition-colors flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            Agregar Equipo
          </button>
        </div>
      </div>

      <div className="p-8 bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, marca, modelo o serial"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-400 focus:border-transparent shadow-sm"
              />
            </div>
          </div>

          {/* Filters and View Toggle */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-3">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === "all"
                    ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                    : "bg-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                Todos los estados
                <span className="ml-2 opacity-70">({equipments.length})</span>
              </button>
              <button
                onClick={() => setFilter(EquipmentStatus.AVAILABLE)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === EquipmentStatus.AVAILABLE
                    ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                    : "bg-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                Disponibles
                <span className="ml-2 opacity-70">
                  ({equipments.filter(e => e.currentStatus === EquipmentStatus.AVAILABLE).length})
                </span>
              </button>
              <button
                onClick={() => setFilter(EquipmentStatus.IN_REPAIR)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === EquipmentStatus.IN_REPAIR
                    ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                    : "bg-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                En Reparación
                <span className="ml-2 opacity-70">
                  ({equipments.filter(e => e.currentStatus === EquipmentStatus.IN_REPAIR).length})
                </span>
              </button>
              <button
                onClick={() => setFilter(EquipmentStatus.RETIRED)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === EquipmentStatus.RETIRED
                    ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                    : "bg-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                Retirados
                <span className="ml-2 opacity-70">
                  ({equipments.filter(e => e.currentStatus === EquipmentStatus.RETIRED).length})
                </span>
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                title="Vista de tarjetas"
              >
                <Squares2X2Icon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                title="Vista de tabla"
              >
                <ListBulletIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Equipment List/Grid */}
          {filteredEquipments.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm text-center py-16">
              <div className="p-6">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-5xl">💻</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {searchTerm || filter !== "all"
                    ? "No se encontraron equipos"
                    : "No tienes equipos registrados"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || filter !== "all"
                    ? "Intenta con otros términos de búsqueda o filtros"
                    : "Comienza agregando tu primer equipo para poder solicitar reparaciones"}
                </p>
                {!searchTerm && filter === "all" && (
                  <button
                    onClick={() => navigate("/user/equipments/new")}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    <PlusIcon className="w-5 h-5" />
                    Agregar mi primer equipo
                  </button>
                )}
              </div>
            </div>
          ) : viewMode === "list" ? (
            <EquipmentTable
              equipments={filteredEquipments}
              onDelete={handleDelete}
              onRequestRepair={handleRequestRepair}
              onViewDetails={handleViewDetails}
              onEdit={handleEdit}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEquipments.map((equipment) => (
                <EquipmentCard
                  key={equipment.id}
                  equipment={equipment}
                  onDelete={handleDelete}
                  onRequestRepair={handleRequestRepair}
                  onViewDetails={handleViewDetails}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
