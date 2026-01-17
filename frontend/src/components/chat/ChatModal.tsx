import { useEffect } from 'react';
import ChatModalHeader from './ChatModalHeader';
import ChatMessageList from './ChatMessageList';
import ChatInputArea from './ChatInputArea';
import type{ UIMessage } from '../../types/chat.types';

interface ChatModalProps {
  isOpen: boolean;
  messages: UIMessage[];
  isLoading: boolean;
  onClose: () => void;
  onSendMessage: (text: string, images: string[]) => void;
}

export default function ChatModal({ isOpen, messages, isLoading, onClose, onSendMessage }: ChatModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed bottom-24 right-6 z-50 w-[400px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <ChatModalHeader onClose={onClose} />
        <ChatMessageList messages={messages} isLoading={isLoading} />
        <ChatInputArea onSendMessage={onSendMessage} disabled={isLoading} />
      </div>
    </>
  );
}