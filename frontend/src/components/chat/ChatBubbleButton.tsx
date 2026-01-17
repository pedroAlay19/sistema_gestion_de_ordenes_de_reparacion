import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ChatBubbleButtonProps {
  isOpen: boolean;
  onClick: () => void;
  hasUnread?: boolean;
}

export default function ChatBubbleButton({ isOpen, onClick, hasUnread }: ChatBubbleButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-400 ${
        isOpen ? 'bg-gray-700 hover:bg-gray-800' : 'bg-gray-900 hover:bg-black'
      }`}
      aria-label={isOpen ? 'Cerrar chat' : 'Abrir chat'}
    >
      {/* Notification Badge */}
      {!isOpen && hasUnread && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
          <span className="text-xs font-bold text-white">•</span>
        </div>
      )}

      {/* Icon */}
      <div className="flex items-center justify-center">
        {isOpen ? (
          <XMarkIcon className="w-6 h-6 text-white" />
        ) : (
          <ChatBubbleLeftRightIcon className="w-7 h-7 text-white" />
        )}
      </div>

    </button>
  );
}