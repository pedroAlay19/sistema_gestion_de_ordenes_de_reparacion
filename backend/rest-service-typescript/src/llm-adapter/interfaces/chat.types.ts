export interface MessageContent {
  type: 'text' | 'image';
  text?: string;           // For text content
  imageUrl?: string;       // For remote images (http://...)
  imageBase64?: string;    // For inline base64 (data:image/jpeg;base64,...)
  mimeType?: string;       // image/jpeg, image/png, image/webp
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: MessageContent[];
}

export interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string; // JSON string
  };
}

export interface ChatResponse {
  message: string;
  toolCalls?: ToolCall[];
  finishReason: 'stop' | 'tool_calls' | 'length' | 'content_filter';
}

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}