import { useState, useEffect } from "react";
import {
  WrenchScrewdriverIcon,
  ClockIcon,
  CheckCircleIcon,
  PlayIcon,
  PencilIcon,
  XMarkIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { repairOrders } from "../../api";
import { TicketServiceStatus, type RepairOrderDetail, type UpdateDetailStatusDto } from "../../types/repair-order-detail.types";
import { useAuth } from "../../hooks/useAuth";

export default function MyAssignedDetails() {
  const { user } = useAuth();
  const [details, setDetails] = useState<RepairOrderDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "IN_PROGRESS" | "COMPLETED">("ALL");
  const [showModal, setShowModal] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<RepairOrderDetail | null>(null);
  const [formData, setFormData] = useState<UpdateDetailStatusDto>({
    status: "" as TicketServiceStatus,
    notes: "",
  });

  useEffect(() => {
    if (user?.id) {
      loadDetails();
    }
  }, [user]);

  const loadDetails = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const data = await repairOrders.getMyDetails(user.id);
      setDetails(data);
    } catch (error) {
      console.error("Error loading details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (detail: RepairOrderDetail) => {
    setSelectedDetail(detail);
    setFormData({
      status: detail.status,
      notes: detail.notes || "",
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDetail(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDetail) return;

    try {
      await repairOrders.updateDetailStatus(selectedDetail.id, formData);
      await loadDetails();
      handleCloseModal();
    } catch (error) {
      console.error("Error updating detail:", error);
      alert("Error al actualizar el detalle");
    }
  };

  const handleUpdateStatus = async (detailId: string, newStatus: TicketServiceStatus) => {
    try {
      await repairOrders.updateDetailStatus(detailId, { status: newStatus });
      await loadDetails();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error al actualizar el estado");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "IN_PROGRESS":
        return "bg-slate-900 text-white border-slate-900";
      case "COMPLETED":
        return "bg-white text-slate-900 border-slate-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <ClockIcon className="w-3.5 h-3.5" />;
      case "IN_PROGRESS":
        return <PlayIcon className="w-3.5 h-3.5" />;
      case "COMPLETED":
        return <CheckCircleIcon className="w-3.5 h-3.5" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Pendiente";
      case "IN_PROGRESS":
        return "En Progreso";
      case "COMPLETED":
        return "Completado";
      default:
        return status;
    }
  };

  const filteredDetails = details.filter((detail) => {
    if (filter === "ALL") return true;
    return detail.status === filter;
  });

  const stats = {
    total: details.length,
    pending: details.filter((d) => d.status === "PENDING").length,
    inProgress: details.filter((d) => d.status === "IN_PROGRESS").length,
    completed: details.filter((d) => d.status === "COMPLETED").length,
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-slate-900 rounded-lg">
              <WrenchScrewdriverIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Mis Tareas</h1>
              <p className="text-sm text-slate-500">
                Servicios asignados para completar
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 border-b border-slate-200">
          <div className="flex gap-1">
            <button
              onClick={() => setFilter("ALL")}
              className={`px-4 py-2.5 text-sm font-medium transition-all relative ${
                filter === "ALL"
                  ? "text-slate-900"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Todas <span className="text-slate-400">({stats.total})</span>
              {filter === "ALL" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900" />
              )}
            </button>
            <button
              onClick={() => setFilter("PENDING")}
              className={`px-4 py-2.5 text-sm font-medium transition-all relative ${
                filter === "PENDING"
                  ? "text-slate-900"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Pendientes <span className="text-slate-400">({stats.pending})</span>
              {filter === "PENDING" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900" />
              )}
            </button>
            <button
              onClick={() => setFilter("IN_PROGRESS")}
              className={`px-4 py-2.5 text-sm font-medium transition-all relative ${
                filter === "IN_PROGRESS"
                  ? "text-slate-900"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              En Progreso <span className="text-slate-400">({stats.inProgress})</span>
              {filter === "IN_PROGRESS" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900" />
              )}
            </button>
            <button
              onClick={() => setFilter("COMPLETED")}
              className={`px-4 py-2.5 text-sm font-medium transition-all relative ${
                filter === "COMPLETED"
                  ? "text-slate-900"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Completadas <span className="text-slate-400">({stats.completed})</span>
              {filter === "COMPLETED" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900" />
              )}
            </button>
          </div>
        </div>

        {/* Details List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-slate-900"></div>
          </div>
        ) : filteredDetails.length === 0 ? (
          <div className="py-20 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
              <WrenchScrewdriverIcon className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500">No hay tareas para mostrar</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDetails.map((detail) => (
              <div
                key={detail.id}
                className="group border border-slate-200 rounded-xl p-6 hover:border-slate-300 hover:shadow-sm transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {detail.service.serviceName}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          detail.status
                        )}`}
                      >
                        {getStatusIcon(detail.status)}
                        {getStatusText(detail.status)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                        {detail.repairOrder.equipment.name}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                        {detail.repairOrder.equipment.user.name}
                      </span>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-xs text-slate-500 mb-0.5">Valor</p>
                    <p className="text-xl font-bold text-slate-900">
                      ${detail.repairPrice}
                    </p>
                  </div>
                </div>

                {/* Problem Description */}
                <div className="bg-slate-50 rounded-lg p-4 mb-4">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">
                    Descripción del Problema
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {detail.repairOrder.problemDescription}
                  </p>
                </div>

                {/* Equipment Details */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Equipo</p>
                    <p className="text-sm font-medium text-slate-900">
                      {detail.repairOrder.equipment.brand} {detail.repairOrder.equipment.model}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Contacto</p>
                    <p className="text-sm font-medium text-slate-900">
                      {detail.repairOrder.equipment.user.email}
                    </p>
                  </div>
                </div>

                {/* Notes */}
                {detail.notes && (
                  <div className="mb-4 border-t border-slate-100 pt-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">
                      Notas del Técnico
                    </p>
                    <p className="text-sm text-slate-700">{detail.notes}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  {detail.status === "PENDING" && (
                    <button
                      onClick={() => handleUpdateStatus(detail.id, TicketServiceStatus.IN_PROGRESS)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium text-sm"
                    >
                      <PlayIcon className="w-4 h-4" />
                      Iniciar Trabajo
                    </button>
                  )}
                  {detail.status === "IN_PROGRESS" && (
                    <>
                      <button
                        onClick={() => handleOpenModal(detail)}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm"
                      >
                        <PencilIcon className="w-4 h-4" />
                        Editar
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(detail.id, TicketServiceStatus.COMPLETED)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium text-sm"
                      >
                        <CheckCircleIcon className="w-4 h-4" />
                        Completar
                      </button>
                    </>
                  )}
                  {detail.status === "COMPLETED" && (
                    <div className="flex-1 flex items-center justify-center gap-2 py-2.5 text-slate-500 text-sm">
                      <CheckCircleIcon className="w-4 h-4" />
                      <span className="font-medium">Trabajo Completado</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Edición */}
      {showModal && selectedDetail && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-900 rounded-lg">
                    <WrenchScrewdriverIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Actualizar Tarea</h2>
                    <p className="text-sm text-slate-500">{selectedDetail.service.serviceName}</p>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="p-6">
              {/* Status Selector */}
              <div className="mb-6">
                <label className="text-sm font-medium text-slate-700 mb-3 block">
                  Estado del Trabajo
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: TicketServiceStatus.PENDING })}
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all border ${
                      formData.status === TicketServiceStatus.PENDING
                        ? "bg-slate-100 text-slate-900 border-slate-300"
                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    Pendiente
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: TicketServiceStatus.IN_PROGRESS })}
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all border ${
                      formData.status === TicketServiceStatus.IN_PROGRESS
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    En Progreso
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: TicketServiceStatus.COMPLETED })}
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all border ${
                      formData.status === TicketServiceStatus.COMPLETED
                        ? "bg-white text-slate-900 border-slate-300"
                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    Completado
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                  <DocumentTextIcon className="w-4 h-4 text-slate-500" />
                  Notas y Observaciones
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows={4}
                  placeholder="Describe el trabajo realizado, piezas reemplazadas, observaciones..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent resize-none text-sm"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium text-sm"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
