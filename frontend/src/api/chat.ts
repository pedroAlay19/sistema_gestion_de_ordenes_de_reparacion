import type { ChatRequest, ChatResult } from '../types/chat.types';
import { http } from './http';

export const chatAPI = {
  /**
   * Send a chat message to the AI
   */
  async sendMessage(request: ChatRequest): Promise<ChatResult> {
    const response = await http.post<ChatResult>('/api/llm/chat', request, true);
    return response;
  },
};