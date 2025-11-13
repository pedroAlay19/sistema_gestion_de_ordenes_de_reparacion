import { CheckCircleIcon } from "@heroicons/react/24/outline";
import type { SparePart } from "../../../api";

interface AvailablePartsListProps {
  parts: SparePart[];
  selectedPartIds: string[];
  onSelectPart: (part: SparePart) => void;
}

export function AvailablePartsList({
  parts,
  selectedPartIds,
  onSelectPart,
}: AvailablePartsListProps) {
  return (
    <div>
      <p className="text-sm font-semibold text-gray-700 mb-2">Piezas Disponibles</p>
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {parts.map((part) => {
          const isSelected = selectedPartIds.includes(part.id);
          return (
            <button
              key={part.id}
              onClick={() => !isSelected && onSelectPart(part)}
              disabled={isSelected}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                isSelected
                  ? "bg-green-50 border-green-300 cursor-not-allowed"
                  : "bg-white border-gray-200 hover:border-purple-400 hover:bg-purple-50"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900 text-sm flex items-center gap-2">
                    {part.name}
                    {isSelected && <CheckCircleIcon className="w-4 h-4 text-green-600" />}
                  </h5>
                  <p className="text-xs text-gray-600 mt-1">{part.description}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs font-semibold text-purple-600">
                      ${Number(part.unitPrice).toFixed(2)}
                    </span>
                    <span className="text-xs text-gray-500">Stock: {part.stock}</span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
