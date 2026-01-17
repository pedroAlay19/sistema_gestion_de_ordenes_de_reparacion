import { XMarkIcon, MinusIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface ChatModalHeaderProps {
  onClose: () => void;
  onMinimize?: () => void;
}

export default function ChatModalHeader({ onClose, onMinimize }: ChatModalHeaderProps) {
  return (
    <div className="bg-gray-900 px-4 py-3 rounded-t-2xl flex items-center justify-between border-b border-gray-700">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
          <SparklesIcon className="w-5 h-5 text-gray-300" />
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm">Asistente AI</h3>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-400 text-xs">En línea</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {onMinimize && (
          <button
            onClick={onMinimize}
            className="w-8 h-8 rounded-lg hover:bg-gray-800 flex items-center justify-center"
            aria-label="Minimizar"
          >
            <MinusIcon className="w-5 h-5 text-white" />
          </button>
        )}
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg hover:bg-gray-800 flex items-center justify-center"
          aria-label="Cerrar"
        >
          <XMarkIcon className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
}