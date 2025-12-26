import { useState, useEffect } from "react";
import { spareParts as sparePartsAPI } from "../../api/spare-parts";
import {
  PlusIcon,
  TrashIcon,
  CubeIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  BellAlertIcon,
} from "@heroicons/react/24/outline";
import type {
  SparePart,
  CreateSparePartDto,
  UpdateSparePartDto,
} from "../../types/spare-part.types";
import { SparePartModal } from "../../components/admin/SparePartModal";
import { generateSparePartsReport, generateLowStockReport } from "../../api/reports";
import { downloadPdfFromBase64 } from "../../utils/pdfDownload";

export default function SparePartsManagement() {
  const [spareParts, setSpareParts] = useState<SparePart[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSparePart, setSelectedSparePart] = useState<
    SparePart | undefined
  >();
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [searchTerm, setSearchTerm] = useState("");
  const [generatingInventoryReport, setGeneratingInventoryReport] = useState(false);
  const [generatingLowStockReport, setGeneratingLowStockReport] = useState(false);

  useEffect(() => {
    loadSpareParts();
  }, []);

  const loadSpareParts = async () => {
    try {
      setLoading(true);
      const data = await sparePartsAPI.getAll();
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

  const handleGenerateInventoryReport = async () => {
    try {
      console.log('Generando reporte de inventario completo...');
      setGeneratingInventoryReport(true);

      const base64Pdf = await generateSparePartsReport();
      downloadPdfFromBase64(base64Pdf, 'reporte-inventario-repuestos.pdf');
      console.log('Reporte de inventario generado exitosamente');

    } catch (error: any) {
      console.error("Error al generar reporte de inventario:", error);
      const errorMessage = error?.message || "Error desconocido al generar el reporte";
      alert(`Error al generar el reporte:\n${errorMessage}`);
    } finally {
      setGeneratingInventoryReport(false);
    }
  };

  const handleGenerateLowStockReport = async () => {
    try {
      console.log('Generando reporte de stock bajo...');
      setGeneratingLowStockReport(true);

      const base64Pdf = await generateLowStockReport(5);
      downloadPdfFromBase64(base64Pdf, 'reporte-stock-bajo.pdf');
      console.log('Reporte de stock bajo generado exitosamente');

    } catch (error: any) {
      console.error("Error al generar reporte de stock bajo:", error);
      const errorMessage = error?.message || "Error desconocido al generar el reporte";
      alert(`Error al generar el reporte:\n${errorMessage}`);
    } finally {
      setGeneratingLowStockReport(false);
    }
  };

  // Filtrar repuestos solo por nombre
  const filteredParts = spareParts.filter((part) =>
    part.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Repuestos</h1>
            <p className="text-gray-400">
              Gestión de {spareParts.length} repuestos en inventario
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleGenerateLowStockReport}
              disabled={generatingLowStockReport}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-lg hover:bg-orange-500/20 transition-colors disabled:opacity-50 font-medium"
              title="Reporte de stock bajo (< 5 unidades)"
            >
              {generatingLowStockReport ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-400"></div>
                  Generando...
                </>
              ) : (
                <>
                  <BellAlertIcon className="w-5 h-5" />
                  Stock Bajo
                </>
              )}
            </button>
            <button
              onClick={handleGenerateInventoryReport}
              disabled={generatingInventoryReport}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors disabled:opacity-50 font-medium"
              title="Reporte completo de inventario"
            >
              {generatingInventoryReport ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                  Generando...
                </>
              ) : (
                <>
                  <DocumentTextIcon className="w-5 h-5" />
                  Inventario
                </>
              )}
            </button>
            <button
              onClick={handleOpenCreateModal}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors font-medium"
            >
              <PlusIcon className="w-5 h-5" />
              Nuevo Repuesto
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar repuesto por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-950 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="px-6 py-4 text-left">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Repuesto
                      </span>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Precio
                      </span>
                    </th>
                    <th className="px-6 py-4 text-center">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Stock
                      </span>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Valor Total
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
                  {filteredParts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
                            <CubeIcon className="w-8 h-8 text-gray-600" />
                          </div>
                          <p className="text-gray-500 font-medium">No se encontraron repuestos</p>
                          <p className="text-sm text-gray-600">Intenta con otro término de búsqueda</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredParts.map((part) => (
                      <tr key={part.id} className="hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                              <CubeIcon className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-white">{part.name}</div>
                              <div className="text-xs text-gray-400 max-w-md truncate mt-0.5">
                                {part.description || "-"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-emerald-400 font-semibold">
                            ${part.unitPrice}
                          </div>
                          <div className="text-xs text-gray-500">por unidad</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className={`px-4 py-1.5 rounded-lg text-sm font-bold ${
                              part.stock === 0
                                ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                : part.stock < 5
                                ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                                : part.stock < 10
                                ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            }`}>
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
                          <div className="text-blue-400 font-bold">
                            ${(part.unitPrice * part.stock).toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500">en inventario</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleDelete(part.id)}
                              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                              title="Eliminar repuesto"
                            >
                              <TrashIcon className="w-4 h-4" />
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

        <SparePartModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveSparePart}
          sparePart={selectedSparePart}
          mode={modalMode}
        />
      </div>
    </div>
  );
}
