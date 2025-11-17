import { useState, useEffect } from "react";
import { spareParts as sparePartsAPI } from "../../api/spare-parts";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CubeIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  FireIcon,
  SparklesIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import type {
  SparePartType as SparePart,
  CreateSparePartDto,
  UpdateSparePartDto,
} from "../../types";
import { SparePartModal } from "../../components/admin/SparePartModal";
import { getAllSpareParts } from "../../api";

export default function SparePartsManagement() {
  const [spareParts, setSpareParts] = useState<SparePart[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSparePart, setSelectedSparePart] = useState<
    SparePart | undefined
  >();
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStock, setFilterStock] = useState<"all" | "low" | "out">("all");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    loadSpareParts();
  }, []);

  const loadSpareParts = async () => {
    try {
      setLoading(true);
      const data = await getAllSpareParts();
      setSpareParts(data);
    } catch (error) {
      console.error("Error loading spare parts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Está seguro de eliminar este repuesto?")) return;

    try {
      await sparePartsAPI.delete(id);
      setSpareParts(spareParts.filter((sp) => sp.id !== id));
    } catch (error) {
      console.error("Error deleting spare part:", error);
      alert("Error al eliminar el repuesto");
    }
  };

  const handleOpenCreateModal = () => {
    setSelectedSparePart(undefined);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (sparePart: SparePart) => {
    setSelectedSparePart(sparePart);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleSaveSparePart = async (
    sparePartData: CreateSparePartDto | UpdateSparePartDto
  ) => {
    if (modalMode === "create") {
      const newSparePart = await sparePartsAPI.create(
        sparePartData as CreateSparePartDto
      );
      setSpareParts([...spareParts, newSparePart]);
    } else if (selectedSparePart) {
      const updatedSparePart = await sparePartsAPI.update(
        selectedSparePart.id,
        sparePartData as UpdateSparePartDto
      );
      setSpareParts(
        spareParts.map((sp) =>
          sp.id === updatedSparePart.id ? updatedSparePart : sp
        )
      );
    }
  };

  // KPIs calculations
  const lowStockItems = spareParts.filter((p) => p.stock > 0 && p.stock < 5);
  const outOfStockItems = spareParts.filter((p) => p.stock === 0);
  const totalInventoryValue = spareParts.reduce(
    (acc, p) => acc + p.unitPrice * p.stock,
    0
  );

  // Calcular nuevos items (últimos 7 días)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const newItems = spareParts.filter((p) => {
    const createdDate = new Date(p.createdAt);
    return createdDate >= sevenDaysAgo;
  });

  // Filtrar repuestos
  const filteredParts = spareParts.filter((part) => {
    const matchesSearch =
      part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStock === "low")
      return matchesSearch && part.stock > 0 && part.stock < 5;
    if (filterStock === "out") return matchesSearch && part.stock === 0;
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Repuestos</h1>
          <p className="text-gray-400 mt-1">
            Gestión de inventario de repuestos
          </p>
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
            Nuevo Repuesto
          </button>
        </div>
      </div>

      {/* KPIs Críticos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Stock Bajo - CRUCIAL */}
        <button
          onClick={() => setFilterStock(filterStock === "low" ? "all" : "low")}
          className={`bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-lg p-4 border-2 transition-all hover:scale-105 text-left ${
            filterStock === "low" ? "border-orange-500" : "border-orange-500/30"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FireIcon className="w-5 h-5 text-orange-500" />
                <p className="text-orange-400 text-xs font-medium">
                  Stock Bajo
                </p>
              </div>
              <p className="text-3xl font-bold text-white">
                {lowStockItems.length}
              </p>
              <p className="text-xs text-gray-400 mt-1">{"< 5 unidades"}</p>
            </div>
            <div className="text-4xl">🔥</div>
          </div>
        </button>

        {/* KPI 2: Sin Stock - CRUCIAL */}
        <button
          onClick={() => setFilterStock(filterStock === "out" ? "all" : "out")}
          className={`bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-lg p-4 border-2 transition-all hover:scale-105 text-left ${
            filterStock === "out" ? "border-red-500" : "border-red-500/30"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                <p className="text-red-400 text-xs font-medium">Agotados</p>
              </div>
              <p className="text-3xl font-bold text-white">
                {outOfStockItems.length}
              </p>
              <p className="text-xs text-gray-400 mt-1">0 unidades</p>
            </div>
            <div className="text-4xl">⚠️</div>
          </div>
        </button>

        {/* KPI 3: Nuevos Items (últimos 7 días) */}
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg p-4 border-2 border-blue-500/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <SparklesIcon className="w-5 h-5 text-blue-500" />
                <p className="text-blue-400 text-xs font-medium">Esta Semana</p>
              </div>
              <p className="text-3xl font-bold text-white">{newItems.length}</p>
              <p className="text-xs text-gray-400 mt-1">Nuevos items</p>
            </div>
            <div className="text-4xl">📦</div>
          </div>
        </div>

        {/* KPI 4: Total Items */}
        <button
          onClick={() => setFilterStock("all")}
          className={`bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg p-4 border-2 transition-all hover:scale-105 text-left ${
            filterStock === "all" ? "border-purple-500" : "border-purple-500/30"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CubeIcon className="w-5 h-5 text-purple-500" />
                <p className="text-purple-400 text-xs font-medium">Catálogo</p>
              </div>
              <p className="text-3xl font-bold text-white">
                {spareParts.length}
              </p>
              <p className="text-xs text-gray-400 mt-1">Total items</p>
            </div>
            <div className="text-4xl">📋</div>
          </div>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar repuestos por nombre o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Repuesto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredParts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-gray-400"
                    >
                      {filterStock !== "all"
                        ? `No hay repuestos ${
                            filterStock === "low"
                              ? "con stock bajo"
                              : "agotados"
                          }`
                        : "No se encontraron repuestos"}
                    </td>
                  </tr>
                ) : (
                  filteredParts.map((part) => (
                    <tr
                      key={part.id}
                      className="hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                            <CubeIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-white font-medium">
                              {part.name}
                            </div>
                            <div className="text-xs text-gray-400 max-w-md truncate">
                              {part.description || "-"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-green-400 font-semibold text-lg">
                          ${part.unitPrice}
                        </div>
                        <div className="text-xs text-gray-500">por unidad</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span
                            className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                              part.stock === 0
                                ? "bg-red-500/20 text-red-400 border border-red-500/50"
                                : part.stock < 5
                                ? "bg-orange-500/20 text-orange-400 border border-orange-500/50"
                                : part.stock < 10
                                ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50"
                                : "bg-green-500/20 text-green-400 border border-green-500/50"
                            }`}
                          >
                            {part.stock}
                          </span>
                          <span className="text-[10px] text-gray-500">
                            {part.stock === 0 && "⚠️ Agotado"}
                            {part.stock > 0 && part.stock < 5 && "🔥 Bajo"}
                            {part.stock >= 5 && part.stock < 10 && "⚡ Normal"}
                            {part.stock >= 10 && "✅ Alto"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-blue-400 font-bold text-lg">
                          ${(part.unitPrice * part.stock).toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">valor total</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(part)}
                            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded-lg transition-all"
                            title="Editar repuesto"
                          >
                            <PencilIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(part.id)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-all"
                            title="Eliminar repuesto"
                          >
                            <TrashIcon className="w-5 h-5" />
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

        {/* Footer con valor total del inventario */}
        <div className="bg-gray-900 px-6 py-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Mostrando{" "}
              <span className="text-white font-medium">
                {filteredParts.length}
              </span>{" "}
              de{" "}
              <span className="text-white font-medium">
                {spareParts.length}
              </span>{" "}
              repuestos
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">
                Valor Total del Inventario:
              </span>
              <span className="text-lg font-bold text-green-400">
                ${totalInventoryValue.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <SparePartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSparePart}
        sparePart={selectedSparePart}
        mode={modalMode}
      />
    </div>
  );
}
