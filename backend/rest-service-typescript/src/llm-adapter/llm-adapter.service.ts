import { Injectable, BadRequestException } from '@nestjs/common';
import { ILLMProvider } from './interfaces/llm-provider.interface';
import { GeminiProvider } from './providers/gemini.provider';
import { MCPClient } from './clients/mcp-client';
import { ChatRequestDto } from './dto/chat-request.dto';
import { Message, ToolCall } from './interfaces/chat.types';
import { ToolExecutionResult, ChatResult } from './interfaces/tool-execution.types';

@Injectable()
export class LLMAdapterService {
  private providers: Map<string, ILLMProvider>;

  constructor(
    private readonly mcpClient: MCPClient,
    private readonly geminiProvider: GeminiProvider,
  ) {
    // Initialize provider registry
    this.providers = new Map<string, ILLMProvider>([
      ['gemini', this.geminiProvider],
    ]);
  }

  async chat(request: ChatRequestDto): Promise<ChatResult> {
    const provider = this.getProvider(request.provider || 'gemini');

    // Step 1: Fetch available tools from MCP server
    const tools = await this.mcpClient.listTools();
    console.log(`Fetched ${tools.length} tools from MCP server`);

    // Track all tool executions across iterations
    const allToolsExecuted: string[] = [];
    const allToolResults: ToolExecutionResult[] = [];
    
    // Build conversation history
    const conversationHistory: Message[] = [...request.messages];
    
    // Step 2: Iterative loop - allow multiple rounds of tool calls
    const maxIterations = 10; // Prevent infinite loops
    let iteration = 0;
    
    while (iteration < maxIterations) {
      iteration++;
      console.log(`\n=== Iteration ${iteration} ===`);
      
      // Send current conversation to LLM
      const response = await provider.chat(conversationHistory, tools);
      console.log(`LLM response: ${response.message?.substring(0, 100) || 'Tool calls only'}...`);

      // Step 3: If LLM wants to call tools, execute them
      if (response.toolCalls && response.toolCalls.length > 0) {
        console.log(`Executing ${response.toolCalls.length} tool call(s)`);
        
        const toolResults = await this.executeTools(response.toolCalls);
        
        // Track all executions
        allToolsExecuted.push(...response.toolCalls.map(tc => tc.function.name));
        allToolResults.push(...toolResults);

        // Add assistant response (with tool calls) to conversation
        conversationHistory.push({
          role: 'assistant',
          content: [
            {
              type: 'text',
              text: response.message || 'Calling tools...'
            }
          ],
        });

        // Add tool results to conversation
        conversationHistory.push({
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Tool results: ${JSON.stringify(toolResults, null, 2)}`
            }
          ],
        });

        // Continue loop to let LLM decide next action
        console.log('Tool results added to conversation. Continuing iteration...');
        continue;
      }

      // No more tool calls - LLM has provided final answer
      console.log('No tool calls. Returning final response.');
      return {
        response: response.message,
        toolsExecuted: allToolsExecuted,
        toolResults: allToolResults.length > 0 ? allToolResults : undefined,
      };
    }

    // Max iterations reached
    console.warn(`Max iterations (${maxIterations}) reached`);
    return {
      response: 'I executed multiple tools but need more iterations to complete. Please try again or rephrase your request.',
      toolsExecuted: allToolsExecuted,
      toolResults: allToolResults,
    };
  }

  /**
   * Execute tool calls via MCP server
   */
  private async executeTools(toolCalls: ToolCall[]): Promise<ToolExecutionResult[]> {
    const results: ToolExecutionResult[] = [];

    for (const call of toolCalls) {
      try {
        const args = JSON.parse(call.function.arguments) as Record<string, unknown>;
        const result = await this.mcpClient.callTool(call.function.name, args);
        
        results.push({
          toolName: call.function.name,
          result,
          success: true,
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        results.push({
          toolName: call.function.name,
          error: errorMessage,
          success: false,
        });
      }
    }

    return results;
  }

  /**
   * Get provider instance (Strategy selection)
   */
  private getProvider(name: string): ILLMProvider {
    const provider = this.providers.get(name);
    if (!provider) {
      throw new BadRequestException(
        `Provider "${name}" not supported. Available: ${Array.from(this.providers.keys()).join(', ')}`
      );
    }
    return provider;
  }

  /**
   * Get list of available tools from MCP
   */
  async getAvailableTools() {
    return this.mcpClient.listTools();
  }
}