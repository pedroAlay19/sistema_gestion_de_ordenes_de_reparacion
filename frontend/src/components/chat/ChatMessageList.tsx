import { useEffect, useRef } from 'react';
import type{ UIMessage } from '../../types/chat.types';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import { CheckCircleIcon, DocumentIcon, MagnifyingGlassCircleIcon, WrenchIcon } from '@heroicons/react/24/outline';

interface ChatMessageListProps {
  messages: UIMessage[];
  isLoading: boolean;
}

export default function ChatMessageList({ messages, isLoading }: ChatMessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50">
      <div className="space-y-4">
        {/* Empty state */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              ¡Hola!
            </h3>
            <p className="text-xs text-gray-500 max-w-xs mb-4">
              Soy tu asistente AI. Puedo ayudarte con:
            </p>
            
            {/* Available Actions */}
            <div className="text-left space-y-2 bg-white rounded-lg p-3 border border-gray-200 max-w-xs">
              <div className="flex items-start gap-2">
                <MagnifyingGlassCircleIcon className="w-5 h-5 text-gray-900 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-gray-900">Buscar Equipos</p>
                  <p className="text-xs text-gray-500">Encuentra equipos por nombre o modelo</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <CheckCircleIcon className="w-5 h-5 text-gray-900 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-gray-900">Validar Disponibilidad</p>
                  <p className="text-xs text-gray-500">Verifica si un equipo está disponible</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <WrenchIcon className="w-5 h-5 text-gray-900 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-gray-900">Crear Orden de Reparación</p>
                  <p className="text-xs text-gray-500">Registra un nuevo problema de equipo</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <DocumentIcon className="w-5 h-5 text-gray-900 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-gray-900">Ver Órdenes</p>
                  <p className="text-xs text-gray-500">Consulta órdenes de un equipo</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {/* Typing indicator */}
        {isLoading && <TypingIndicator />}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}