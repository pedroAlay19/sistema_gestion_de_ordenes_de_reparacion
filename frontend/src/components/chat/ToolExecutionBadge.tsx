import { CheckCircleIcon, XCircleIcon, WrenchIcon } from '@heroicons/react/24/outline';

interface ToolExecutionBadgeProps {
  toolName: string;
  success: boolean;
}

export default function ToolExecutionBadge({ toolName, success }: ToolExecutionBadgeProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
        success
          ? 'bg-green-50 text-green-700 border border-green-200'
          : 'bg-red-50 text-red-700 border border-red-200'
      }`}
    >
      <WrenchIcon className="w-3.5 h-3.5" />
      <span>{toolName.replace(/_/g, ' ')}</span>
      {success ? (
        <CheckCircleIcon className="w-3.5 h-3.5" />
      ) : (
        <XCircleIcon className="w-3.5 h-3.5" />
      )}
    </div>
  );
}