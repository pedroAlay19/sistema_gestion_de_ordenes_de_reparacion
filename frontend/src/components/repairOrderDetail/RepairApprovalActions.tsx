import {
  CheckCircleIcon,
  WrenchScrewdriverIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { repairOrders } from "../../api";
import { useNavigate } from "react-router-dom";

export const RepairApprovalActions: React.FC<{ id: string }> = ({ id }) => {
  const navigate = useNavigate();

  const handleApprove = async () => {
    await repairOrders.approve(id);
    navigate("/user/repair-orders");
  };

  const handleReject = async () => {
    await repairOrders.reject(id);
    navigate("/user/repair-orders");
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 transition-all">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
          <WrenchScrewdriverIcon className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900 leading-tight">
            Acciones Requeridas
          </h3>
          <p className="text-gray-500 text-sm">
            Revisa el diagnóstico antes de tomar una decisión
          </p>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 mb-8">
        <p className="text-gray-700 leading-relaxed">
          El técnico ha completado el diagnóstico del equipo. Por favor, aprueba
          o rechaza la reparación para continuar con el proceso.
        </p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleApprove}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-xl font-medium hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm"
        >
          <CheckCircleIcon className="w-5 h-5" />
          Aprobar Reparación
        </button>

        <button
          onClick={handleReject}
          className="flex-1 flex items-center justify-center gap-2 border-2 border-red-500 text-red-600 px-6 py-4 rounded-xl font-medium hover:bg-red-50 active:scale-[0.98] transition-all"
        >
          <XCircleIcon className="w-5 h-5" />
          Rechazar Servicio
        </button>
      </div>
    </div>
  );
};
