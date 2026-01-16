export interface ToolExecutionResult {
  toolName: string;
  result?: unknown;
  error?: string;
  success: boolean;
}

export interface ChatResult {
  response: string;
  toolsExecuted: string[];
  toolResults?: ToolExecutionResult[];
}
