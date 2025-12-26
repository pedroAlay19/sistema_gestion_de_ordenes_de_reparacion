import { XMarkIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import type { SparePart } from "../../../api";

interface PartSelection {
  part: SparePart;
  quantity: number;
}

interface SelectedPartsListProps {
  selections: PartSelection[];
  onRemove: (partId: string) => void;
  onUpdateQuantity: (partId: string, delta: number) => void;
}

export function SelectedPartsList({
  selections,
  onRemove,
  onUpdateQuantity,
}: SelectedPartsListProps) {
  if (selections.length === 0) return null;

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-gray-700">Piezas Seleccionadas</p>
      {selections.map((sel) => (
        <div key={sel.part.id} className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h5 className="font-medium text-gray-900">{sel.part.name}</h5>
              <p className="text-xs text-gray-600">{sel.part.description}</p>
              <p className="text-xs text-gray-500 mt-1">
                Stock: {sel.part.stock} | Precio: ${Number(sel.part.unitPrice).toFixed(2)}
              </p>
            </div>
            <button
              onClick={() => onRemove(sel.part.id)}
              className="text-red-600 hover:text-red-800"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onUpdateQuantity(sel.part.id, -1)}
                className="w-7 h-7 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center justify-center transition-colors"
              >
                <MinusIcon className="w-4 h-4" />
              </button>
              <span className="w-10 text-center font-semibold text-gray-900 text-sm">
                {sel.quantity}
              </span>
              <button
                onClick={() => onUpdateQuantity(sel.part.id, 1)}
                className="w-7 h-7 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center justify-center transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
            <span className="text-sm text-gray-600">
              Subtotal: ${(Number(sel.part.unitPrice) * sel.quantity).toFixed(2)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
