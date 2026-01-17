import { UserIcon, SparklesIcon } from '@heroicons/react/24/outline';
import type{ UIMessage } from '../../types/chat.types';
import ToolExecutionBadge from './ToolExecutionBadge';

interface ChatMessageProps {
  message: UIMessage;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser
            ? 'bg-gray-800'
            : 'bg-gray-700'
        }`}
      >
        {isUser ? (
          <UserIcon className="w-5 h-5 text-white" />
        ) : (
          <SparklesIcon className="w-5 h-5 text-white" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-2xl ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
        {/* Content bubbles */}
        {message.content.map((content, idx) => (
          <div key={idx}>
            {content.type === 'text' && content.text && (
              <div
                className={`rounded-2xl px-4 py-3 ${
                  isUser
                    ? 'bg-gray-800 text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{content.text}</p>
              </div>
            )}

            {content.type === 'image' && (content.imageBase64 || content.imageUrl) && (
              <div className="rounded-2xl overflow-hidden border border-gray-200 max-w-sm">
                <img
                  src={content.imageBase64 || content.imageUrl}
                  alt="Uploaded"
                  className="w-full h-auto"
                />
              </div>
            )}
          </div>
        ))}

        {/* Tool execution badges */}
        {message.toolsExecuted && message.toolsExecuted.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {message.toolResults?.map((result, idx) => (
              <ToolExecutionBadge
                key={idx}
                toolName={result.toolName}
                success={result.success}
              />
            ))}
          </div>
        )}

        {/* Timestamp */}
        <span className="text-xs text-gray-400 px-1">
          {message.timestamp.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  );
}