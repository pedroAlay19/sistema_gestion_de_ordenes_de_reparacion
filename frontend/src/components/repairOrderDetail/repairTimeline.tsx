import { RepairStepItem } from "./repairStepItem";
import { RepairStepConnector } from "./repairStepConnector";
import { getRepairSteps } from "../../data/repairSteps";
import type { RepairOrder } from "../../types/repair-order.types";
import type React from "react";

export const RepairTimeline: React.FC<{ order: RepairOrder }> = ({ order }) => {
  const steps = getRepairSteps(order);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl text-white">
              Estado de la Reparación
            </h2>
            <p className="text-slate-300 text-sm mt-0.5">
              Seguimiento del proceso
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="relative border-l border-gray-200 pl-8">
          {steps.map((step, index) => (
            <div key={index} className="relative mb-8 last:mb-0">
              {index < steps.length - 1 && (
                <RepairStepConnector active={step.status === "completed"} />
              )}
              <RepairStepItem step={step} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
