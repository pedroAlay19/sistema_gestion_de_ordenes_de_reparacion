export interface MessageContent {
  type: 'text' | 'image';
  text?: string;
  imageUrl?: string;
  imageBase64?: string;
  mimeType?: string;
}

// Single message in conversation
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: MessageContent[];
  timestamp?: Date;
}

export interface ToolExecutionResult {
  toolName: string;
  result?: unknown;  // Backend uses 'unknown' not 'any'
  error?: string;
  success: boolean;
}

export interface ChatRequest {
  provider?: 'gemini' | 'openai';
  messages: ChatMessage[];
}

export interface ChatResult {
  response: string;              // Backend returns 'response' not 'message'
  toolsExecuted: string[];       // Always present, not optional
  toolResults?: ToolExecutionResult[];
}

export interface UIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: MessageContent[];
  timestamp: Date;
  toolsExecuted?: string[];
  toolResults?: ToolExecutionResult[];
  isLoading?: boolean;
}