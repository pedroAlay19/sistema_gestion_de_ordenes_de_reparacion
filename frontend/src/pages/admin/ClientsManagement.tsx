import { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  UserIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { users } from "../../api";
import type { UserProfile } from "../../types/user.types";
import { generateUsersReport } from "../../api/reports";
import { downloadPdfFromBase64 } from "../../utils/pdfDownload";

export default function ClientsManagement() {
  const [clients, setClients] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [generatingReport, setGeneratingReport] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await users.findUsers();
      setClients(data);
    } catch (error) {
      console.error("Error loading clients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateUsersReport = async () => {
    try {
      console.log('Generando reporte de todos los usuarios...');
      setGeneratingReport(true);

      const base64Pdf = await generateUsersReport();
      downloadPdfFromBase64(base64Pdf, 'reporte-usuarios-completo.pdf');
      console.log('Reporte de usuarios generado exitosamente');

    } catch (error: unknown) {
      console.error("Error al generar reporte de usuarios:", error);
      const errorMessage = error instanceof Error ? error.message : "Error desconocido al generar el reporte";
      alert(`Error al generar el reporte:\n${errorMessage}`);
    } finally {
      setGeneratingReport(false);
    }
  };

  const filteredClients = searchTerm.trim() === ""
    ? clients
    : clients.filter(
        (client) =>
          (client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
          (client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
      );

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Clientes</h1>
            <p className="text-gray-400">
              Gestión de {clients.length} clientes del sistema
            </p>
          </div>
          
          {/* Report Button */}
          <button
            onClick={handleGenerateUsersReport}
            disabled={generatingReport}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 hover:bg-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Descargar reporte de usuarios"
          >
            {generatingReport ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-400 border-t-transparent"></div>
                <span className="text-sm font-medium">Generando...</span>
              </>
            ) : (
              <>
                <DocumentTextIcon className="w-5 h-5" />
                <span className="text-sm font-medium">Reporte</span>
              </>
            )}
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-950 border border-gray-800 rounded-lg text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-colors"
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-32 bg-gray-900/50 border border-gray-800 rounded-lg">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Cargando clientes...</p>
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
                        Cliente
                      </span>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Email
                      </span>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Teléfono
                      </span>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Dirección
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredClients.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
                            <UserIcon className="w-8 h-8 text-gray-600" />
                          </div>
                          <p className="text-gray-500 font-medium">No se encontraron clientes</p>
                          <p className="text-sm text-gray-600">Intenta con otro término de búsqueda</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredClients.map((client) => (
                      <tr
                        key={client.id}
                        className="hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                              <UserIcon className="w-5 h-5 text-cyan-400" />
                            </div>
                            <span className="text-sm font-medium text-white">
                              {client.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-300">{client.email}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-300">{client.phone || "-"}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-300 max-w-xs truncate block">
                            {client.address || "-"}
                          </span>
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
    </div>
  );
}
