import { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  TrashIcon,
  ComputerDesktopIcon,
  DocumentArrowDownIcon,
  ChevronRightIcon,
  XCircleIcon,
  ClockIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import { equipments } from "../../api";
import type { Equipment } from "../../types/equipment.types";
import { EquipmentStatus } from "../../types/equipment.types";
import { OrderRepairStatus } from "../../types/repair-order.types";
import { generateEquipmentReport } from "../../api/reports";
import { downloadPdfFromBase64 } from "../../utils/pdfDownload";
import { getOrderStatusText } from "../../utils/statusUtils";

export default function EquipmentManagement() {
  const [equipmentsList, setEquipmentsList] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [generatingReportId, setGeneratingReportId] = useState<string | null>(null);

  useEffect(() => {
    const loadEquipments = async () => {
      try {
        setLoading(true);
        const data = await equipments.getAll();
        setEquipmentsList(data);
      } catch (error) {
        console.error("Error loading equipments:", error);
      } finally {
        setLoading(false);
      }
    };
    loadEquipments();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Está seguro de eliminar este equipo?")) return;

    try {
      await equipments.delete(id);
      setEquipmentsList(equipmentsList.filter((e) => e.id !== id));
    } catch (error) {
      console.error("Error deleting equipment:", error);
      alert("Error al eliminar el equipo");
    }
  };

  const handleGenerateReport = async (equipmentId: string, equipmentName: string) => {
    try {
      console.log('Iniciando generación de reporte para equipo:', equipmentId);
      setGeneratingReportId(equipmentId);

      // Call GraphQL to generate PDF
      console.log('Llamando a generateEquipmentReport...');
      const base64Pdf = await generateEquipmentReport(equipmentId);
      console.log('Reporte generado exitosamente, descargando PDF...');

      // Download PDF
      const sanitizedName = equipmentName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
      downloadPdfFromBase64(base64Pdf, `reporte-equipo-${sanitizedName}.pdf`);
      console.log('PDF descargado exitosamente');

    } catch (error: unknown) {
      console.error("Error completo al generar reporte:", error);
      console.error("Mensaje de error:", error instanceof Error ? error.message : 'Error desconocido');
      console.error("Stack trace:", error instanceof Error ? error.stack : 'N/A');
      
      const errorMessage = error instanceof Error ? error.message : "Error desconocido al generar el reporte";
      alert(`Error al generar el reporte:\n${errorMessage}`);
    } finally {
      setGeneratingReportId(null);
    }
  };

  const filteredEquipments = equipmentsList.filter(
    (equipment) =>
      equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="flex">
        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${selectedEquipment ? 'mr-96' : ''}`}>
          <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Equipos</h1>
                <p className="text-gray-400">
                  Gestión de {equipmentsList.length} equipos registrados en el sistema
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
              <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, marca, modelo o serial..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
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
                            Equipo
                          </span>
                        </th>
                        <th className="px-6 py-4 text-left">
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Tipo
                          </span>
                        </th>
                        <th className="px-6 py-4 text-left">
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Estado
                          </span>
                        </th>
                        <th className="px-6 py-4 text-left">
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Propietario
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
                      {filteredEquipments.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-16 text-center">
                            <div className="flex flex-col items-center gap-3">
                              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
                                <ComputerDesktopIcon className="w-8 h-8 text-gray-600" />
                              </div>
                              <p className="text-gray-500 font-medium">No se encontraron equipos</p>
                              <p className="text-sm text-gray-600">Intenta con otro término de búsqueda</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredEquipments.map((equipment) => {
                          const isSelected = selectedEquipment?.id === equipment.id;
                          
                          return (
                            <tr
                              key={equipment.id}
                              onClick={() => setSelectedEquipment(equipment)}
                              className={`cursor-pointer transition-colors ${
                                isSelected 
                                  ? 'bg-emerald-500/5 border-l-2 border-emerald-500' 
                                  : 'hover:bg-gray-800/50'
                              }`}
                                    >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                    <ComputerDesktopIcon className="w-5 h-5 text-blue-400" />
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium text-white">
                                      {equipment.name}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                      {equipment.brand} {equipment.model}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      SN: {equipment.serialNumber || "N/A"}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-3 py-1 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                  {equipment.type}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                                  equipment.currentStatus === EquipmentStatus.AVAILABLE
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                    : equipment.currentStatus === EquipmentStatus.IN_REPAIR
                                    ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                    : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                                }`}>
                                  {equipment.currentStatus === EquipmentStatus.AVAILABLE ? 'Disponible' : 
                                   equipment.currentStatus === EquipmentStatus.IN_REPAIR ? 'En reparación' : 
                                   'Retirado'}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div>
                                  <div className="text-sm font-medium text-white">
                                    {equipment.user.name || "-"}
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    {equipment.user.email || "-"}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {equipment.user.phone || "-"}
                                  </div>
                                </div>
                              </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleGenerateReport(equipment.id, equipment.name);
                                    }}
                                    disabled={generatingReportId === equipment.id}
                                    className="p-2 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors disabled:opacity-50"
                                    title="Generar reporte PDF"
                                  >
                                    {generatingReportId === equipment.id ? (
                                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-400 border-t-transparent" />
                                    ) : (
                                      <DocumentArrowDownIcon className="w-4 h-4" />
                                    )}
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDelete(equipment.id);
                                    }}
                                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                    title="Eliminar equipo"
                                  >
                                    <TrashIcon className="w-4 h-4" />
                                  </button>
                                  <ChevronRightIcon className="w-4 h-4 text-gray-600" />
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Detail */}
        {selectedEquipment && (
          <div className="fixed right-0 top-0 h-screen w-96 bg-gray-900 border-l border-gray-800 shadow-2xl overflow-y-auto z-40">
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-gray-800">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-gray-500">
                      #{selectedEquipment.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                      selectedEquipment.currentStatus === EquipmentStatus.AVAILABLE
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : selectedEquipment.currentStatus === EquipmentStatus.IN_REPAIR
                        ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                        : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                    }`}>
                      {selectedEquipment.currentStatus === EquipmentStatus.AVAILABLE ? 'Disponible' : 
                       selectedEquipment.currentStatus === EquipmentStatus.IN_REPAIR ? 'En reparación' : 
                       'Retirado'}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold text-white">Detalles del Equipo</h2>
                </div>
                <button
                  onClick={() => setSelectedEquipment(null)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <XCircleIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Equipment Details */}
              <div className="space-y-4">
                <div className="bg-gray-800/50 border border-gray-800 rounded-lg p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
                    Información del Equipo
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Nombre</span>
                      <span className="text-sm text-white font-medium">
                        {selectedEquipment.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Marca</span>
                      <span className="text-sm text-gray-300">
                        {selectedEquipment.brand}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Modelo</span>
                      <span className="text-sm text-gray-300">
                        {selectedEquipment.model}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Tipo</span>
                      <span className="text-sm text-gray-300">
                        {selectedEquipment.type}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Serial</span>
                      <span className="text-sm text-gray-300 font-mono">
                        {selectedEquipment.serialNumber || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Owner */}
                <div className="bg-gray-800/50 border border-gray-800 rounded-lg p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
                    Propietario
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Nombre</span>
                      <span className="text-sm text-white font-medium">
                        {selectedEquipment.user.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Email</span>
                      <span className="text-sm text-gray-300">
                        {selectedEquipment.user.email || "-"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Teléfono</span>
                      <span className="text-sm text-gray-300">
                        {selectedEquipment.user.phone || "-"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Repair Orders */}
                <div className="bg-gray-800/50 border border-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase">
                      Órdenes de Reparación
                    </p>
                    <span className="text-xs font-bold text-emerald-400">
                      {selectedEquipment.repairOrders?.length || 0}
                    </span>
                  </div>
                  
                  {(!selectedEquipment.repairOrders || selectedEquipment.repairOrders.length === 0) ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No hay órdenes registradas
                    </p>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {selectedEquipment.repairOrders.map((order) => (
                        <div 
                          key={order.id}
                          className="bg-gray-900/50 border border-gray-800 rounded-lg p-3 hover:border-gray-700 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <span className="text-xs font-mono text-gray-500">
                              #{order.id.slice(0, 8).toUpperCase()}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              order.status === OrderRepairStatus.DELIVERED ? 'bg-emerald-500/10 text-emerald-400' :
                              order.status === OrderRepairStatus.IN_REPAIR ? 'bg-yellow-500/10 text-yellow-400' :
                              order.status === OrderRepairStatus.READY ? 'bg-blue-500/10 text-blue-400' :
                              'bg-gray-500/10 text-gray-400'
                            }`}>
                              {getOrderStatusText(order.status)}
                            </span>
                          </div>
                          <p className="text-sm text-white font-medium mb-1 line-clamp-2">
                            {order.problemDescription}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <ClockIcon className="w-3 h-3" />
                            {new Date(order.createdAt).toLocaleDateString("es-ES")}
                          </div>
                          {order.evaluatedBy && (
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                              <WrenchScrewdriverIcon className="w-3 h-3" />
                              {order.evaluatedBy.name}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Dates */}
                <div className="bg-gray-800/50 border border-gray-800 rounded-lg p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
                    Fechas
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Registro</span>
                      <span className="text-xs text-gray-300">
                        {new Date(selectedEquipment.createdAt).toLocaleString("es-ES")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <button
                  onClick={() => handleGenerateReport(selectedEquipment.id, selectedEquipment.name)}
                  disabled={generatingReportId === selectedEquipment.id}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                >
                  {generatingReportId === selectedEquipment.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-400 border-t-transparent"></div>
                      <span className="text-sm font-medium">Generando...</span>
                    </>
                  ) : (
                    <>
                      <DocumentArrowDownIcon className="w-5 h-5" />
                      <span className="text-sm font-medium">Descargar Reporte PDF</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
