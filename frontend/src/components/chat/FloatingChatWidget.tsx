import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ChatBubbleButton from './ChatBubbleButton';
import ChatModal from './ChatModal';
import type { UIMessage, ChatRequest, MessageContent } from '../../types/chat.types';
import { chatAPI } from '../../api/chat';

export default function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load messages from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('chatHistory');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as UIMessage[];
        // Convert timestamp strings back to Date objects
        const messagesWithDates = parsed.map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(messagesWithDates);
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
    }
  }, [messages]);

  const handleSendMessage = async (text: string, images: string[]) => {
    // Build user message content
    const content: MessageContent[] = [];

    // Add text if provided
    if (text.trim()) {
      content.push({
        type: 'text',
        text: text.trim(),
      });
    }

    // Add images if provided
    images.forEach((imageData) => {
      // Extract base64 data and mime type from data URL
      // Format: data:image/jpeg;base64,/9j/4AAQ...
      const mimeType = imageData.split(';')[0].split(':')[1] || 'image/jpeg';
      const base64Data = imageData.includes('base64,') 
        ? imageData.split('base64,')[1] 
        : imageData;
      
      content.push({
        type: 'image',
        imageBase64: base64Data, // Send only base64 string for Gemini
        mimeType,
      });
    });

    // Create user message
    const userMessage: UIMessage = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    // Add user message to UI
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Build API request
      const request: ChatRequest = {
        provider: 'gemini',
        messages: [
          // Include previous messages for context (limit to last 10 for performance)
          // Filter out messages with empty content
          ...messages.slice(-10)
            .filter((msg) => msg.content && msg.content.length > 0 && 
              msg.content.some(c => (c.type === 'text' && c.text) || (c.type === 'image' && c.imageBase64)))
            .map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
          // Add current user message
          {
            role: 'user',
            content,
          },
        ],
      };

      // Call API
      const response = await chatAPI.sendMessage(request);

      // Create assistant message
      const assistantMessage: UIMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: [
          {
            type: 'text',
            text: response.response,
          },
        ],
        timestamp: new Date(),
        toolsExecuted: response.toolsExecuted,
        toolResults: response.toolResults,
      };

      // Add assistant message to UI
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);

      // Add error message
      const err = error as { response?: { data?: { message?: string } } } & Error;
      const errorMessage: UIMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: [
          {
            type: 'text',
            text: `❌ Error: ${err.response?.data?.message || err.message || 'No se pudo enviar el mensaje'}`,
          },
        ],
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ChatBubbleButton
        isOpen={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        hasUnread={false} // You could implement unread logic here
      />
      <ChatModal
        isOpen={isOpen}
        messages={messages}
        isLoading={isLoading}
        onClose={() => setIsOpen(false)}
        onSendMessage={handleSendMessage}
      />
    </>
  );
}