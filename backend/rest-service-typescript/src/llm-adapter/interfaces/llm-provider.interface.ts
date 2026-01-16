import { Message, ChatResponse, MCPTool } from './chat.types';

export interface ILLMProvider {
  /**
   * Send a chat message to the LLM
   * @param messages - Conversation history
   * @param tools - Available MCP tools
   * @returns AI response with optional tool calls
   */
  chat(messages: Message[], tools: MCPTool[]): Promise<ChatResponse>;

  /**
   * Stream chat responses (optional, for real-time responses)
   */
  streamChat?(
    messages: Message[],
    tools: MCPTool[]
  ): AsyncIterator<ChatResponse>;
}