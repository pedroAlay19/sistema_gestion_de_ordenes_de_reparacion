import { useEffect } from "react";
import { BellIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface NotificationToastProps {
  message: string;
  type?: "info" | "success" | "warning" | "error";
  duration?: number;
  onClose: () => void;
}

export default function NotificationToast({
  message,
  type = "info",
  duration = 5000,
  onClose,
}: NotificationToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const colors = {
    info: "bg-blue-600 border-blue-500",
    success: "bg-green-600 border-green-500",
    warning: "bg-yellow-600 border-yellow-500",
    error: "bg-red-600 border-red-500",
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 ${colors[type]} border-l-4 rounded-lg shadow-2xl p-4 min-w-[320px] max-w-md animate-slide-in`}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0">
          <BellIcon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-white font-medium text-sm">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="shrink-0 text-white/80 hover:text-white transition-colors"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
