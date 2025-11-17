import { useState, useEffect } from "react";
import { http } from "../../api/http";
import {
  WrenchScrewdriverIcon,
  ClockIcon,
  CheckCircleIcon,
  PlayIcon,
  PencilIcon,
  XMarkIcon,
  CurrencyDollarIcon,
  TagIcon,
  CalculatorIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

interface RepairOrderDetail {
  id: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  unitPrice: number;
  discount?: number;
  subTotal: number;
  imageUrl?: string;
  notes?: string;
  createdAt: string;
  service: {
    serviceName: string;
    type: string;
  };
  repairOrder: {
    id: string;
    problemDescription: string;
    status: string;
    equipment: {
      name: string;
      brand: string;
      model: string;
      user: {
        name: string;
        email: string;
      };
    };
  };
}

export default function MyAssignedDetails() {
  const [details, setDetails] = useState<RepairOrderDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "IN_PROGRESS" | "COMPLETED">("ALL");
  const [showModal, setShowModal] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<RepairOrderDetail | null>(null);
  const [formData, setFormData] = useState({
    status: "",
    unitPrice: 0,
    discount: 0,
    imageUrl: "",
    notes: "",
  });

  useEffect(() => {
    loadDetails();
  }, []);

  const loadDetails = async () => {
    try {
      setLoading(true);
      const data = await http.get("/repair-orders/technician/my-details", true);
      setDetails(data as RepairOrderDetail[]);
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
      unitPrice: detail.unitPrice,
      discount: detail.discount || 0,
      imageUrl: detail.imageUrl || "",
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
      await http.patch(
        `/repair-orders/technician/detail/${selectedDetail.id}`,
        formData,
        true
      );
      await loadDetails();
      handleCloseModal();
    } catch (error) {
      console.error("Error updating detail:", error);
      alert("Error al actualizar el detalle");
    }
  };

  const handleUpdateStatus = async (detailId: string, newStatus: string) => {
    try {
      await http.patch(
        `/repair-orders/technician/detail/${detailId}/status`,
        { status: newStatus },
        true
      );
      await loadDetails();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error al actualizar el estado");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "COMPLETED":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Tareas Asignadas</h1>
          <p className="text-gray-600 mt-1">
            Servicios de mantenimiento asignados a ti
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <WrenchScrewdriverIcon className="w-12 h-12 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
              </div>
              <ClockIcon className="w-12 h-12 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En Progreso</p>
                <p className="text-3xl font-bold text-gray-900">{stats.inProgress}</p>
              </div>
              <PlayIcon className="w-12 h-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completadas</p>
                <p className="text-3xl font-bold text-gray-900">{stats.completed}</p>
              </div>
              <CheckCircleIcon className="w-12 h-12 text-green-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("ALL")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "ALL"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Todos ({stats.total})
            </button>
            <button
              onClick={() => setFilter("PENDING")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "PENDING"
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Pendientes ({stats.pending})
            </button>
            <button
              onClick={() => setFilter("IN_PROGRESS")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "IN_PROGRESS"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              En Progreso ({stats.inProgress})
            </button>
            <button
              onClick={() => setFilter("COMPLETED")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "COMPLETED"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Completadas ({stats.completed})
            </button>
          </div>
        </div>

        {/* Details List */}
        {loading ? (
          <div className="flex items-center justify-center py-12 bg-white rounded-lg shadow">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredDetails.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <WrenchScrewdriverIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No tienes tareas asignadas</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredDetails.map((detail) => (
              <div
                key={detail.id}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {detail.service.serviceName}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          detail.status
                        )}`}
                      >
                        {getStatusText(detail.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Tipo: {detail.service.type}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Valor</p>
                    <p className="text-xl font-bold text-gray-900">
                      ${detail.subTotal}
                    </p>
                  </div>
                </div>

                {/* Order Info */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Información de la Orden:
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Problema:</span>{" "}
                    {detail.repairOrder.problemDescription}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Equipo:</span>{" "}
                    {detail.repairOrder.equipment.name} -{" "}
                    {detail.repairOrder.equipment.brand}{" "}
                    {detail.repairOrder.equipment.model}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Cliente:</span>{" "}
                    {detail.repairOrder.equipment.user.name} ({detail.repairOrder.equipment.user.email})
                  </p>
                </div>

                {/* Notes */}
                {detail.notes && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">Notas:</p>
                    <p className="text-sm text-gray-600">{detail.notes}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {detail.status !== "PENDING" && (
                    <button
                      onClick={() => handleOpenModal(detail)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                    >
                      <PencilIcon className="w-5 h-5" />
                      Editar Detalle
                    </button>
                  )}
                  {detail.status === "PENDING" && (
                    <button
                      onClick={() => handleUpdateStatus(detail.id, "IN_PROGRESS")}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Iniciar Trabajo
                    </button>
                  )}
                  {detail.status === "IN_PROGRESS" && (
                    <button
                      onClick={() => handleUpdateStatus(detail.id, "COMPLETED")}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Marcar como Completado
                    </button>
                  )}
                  {detail.status === "COMPLETED" && (
                    <div className="flex-1 text-center py-2 text-green-600 font-medium">
                      ✓ Trabajo Completado
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
        <div className="fixed inset-0 bg-gray-900/20 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            {/* Header */}
            <div className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
              <div className="flex items-center gap-3">
                <WrenchScrewdriverIcon className="w-6 h-6" />
                <div>
                  <h2 className="text-lg font-bold">Editar Detalle</h2>
                  <p className="text-sm text-gray-300">{selectedDetail.service.serviceName}</p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-300 hover:text-white transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="p-6">
              {/* Form Fields - 3 columns for compact view */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                {/* Unit Price */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <CurrencyDollarIcon className="w-4 h-4 text-gray-500" />
                    Precio *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.unitPrice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        unitPrice: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Discount */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <TagIcon className="w-4 h-4 text-gray-500" />
                    Descuento
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.discount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discount: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Subtotal (calculated) */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <CalculatorIcon className="w-4 h-4 text-gray-500" />
                    Subtotal
                  </label>
                  <input
                    type="text"
                    value={`$${(formData.unitPrice - formData.discount).toFixed(2)}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-green-50 font-bold text-green-700"
                    disabled
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="mb-4">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <DocumentTextIcon className="w-4 h-4 text-gray-500" />
                  Notas
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows={3}
                  placeholder="Observaciones del trabajo realizado..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
