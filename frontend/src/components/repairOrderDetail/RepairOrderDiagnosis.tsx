import { DocumentTextIcon } from "@heroicons/react/24/outline";

export const RepairOrderDiagnosis: React.FC<{ diagnosis: string; estimatedCost?: number }> = ({
  diagnosis,
  estimatedCost,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <DocumentTextIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl text-white">Diagnóstico Técnico</h3>
            <p className="text-slate-300 text-sm mt-0.5">
              Evaluación profesional del equipo
            </p>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6 space-y-4">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
            {diagnosis}
          </p>
        </div>
        
        {estimatedCost !== undefined && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">
              Costo Estimado
            </p>
            <p className="text-3xl font-bold text-blue-900">
              ${estimatedCost}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Costo aproximado de la reparación
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
