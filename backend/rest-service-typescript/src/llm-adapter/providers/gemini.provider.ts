import { Injectable } from '@nestjs/common';
import {
  GoogleGenerativeAI,
  FunctionCallingMode,
  SchemaType,
  FunctionDeclaration,
  Part,
} from '@google/generative-ai';
import { ILLMProvider } from '../interfaces/llm-provider.interface';
import { Message, ChatResponse, MCPTool } from '../interfaces/chat.types';

interface GeminiMessage {
  role: string;
  parts: Part[];
}

@Injectable()
export class GeminiProvider implements ILLMProvider {
  private readonly client: GoogleGenerativeAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not found in environment variables');
    }
    this.client = new GoogleGenerativeAI(apiKey);
  }

  async chat(messages: Message[], tools: MCPTool[]): Promise<ChatResponse> {
    try {
      const model = this.client.getGenerativeModel({
        model: 'gemini-2.5-flash',
        generationConfig: {
          temperature: 0.7,
        },
      });

      // Convert MCP tools to Gemini function declarations
      const functionDeclarations: FunctionDeclaration[] = tools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        parameters: {
          ...tool.inputSchema,
          type: SchemaType.OBJECT,
        },
      }));

      // Convert messages to Gemini format (with image support)
      const geminiMessages = this.convertMessagesToGeminiFormat(messages);

      const chat = model.startChat({
        history: geminiMessages.slice(0, -1),
        tools: functionDeclarations.length > 0 ? [{ functionDeclarations }] : undefined,
        toolConfig: functionDeclarations.length > 0 ? {
          functionCallingConfig: {
            mode: FunctionCallingMode.AUTO,
          },
        } : undefined,
      });

      // Send last message
      const lastMessage = geminiMessages[geminiMessages.length - 1];
      const result = await chat.sendMessage(lastMessage.parts);

      const response = result.response;
      const functionCalls = response.functionCalls();

      // If Gemini wants to call a function
      if (functionCalls && functionCalls.length > 0) {
        return {
          message: response.text() || 'Calling tools...',
          toolCalls: functionCalls.map((fc, index) => ({
            id: `call_${Date.now()}_${index}`,
            type: 'function',
            function: {
              name: fc.name,
              arguments: JSON.stringify(fc.args),
            },
          })),
          finishReason: 'tool_calls',
        };
      }

      // Normal text response
      return {
        message: response.text(),
        finishReason: 'stop',
      };
    } catch (error) {
      console.error('❌ Gemini API error:', error);
      throw error;
    }
  }

  /**
   * Converts messages to Gemini format with multimodal support
   * 
   * Gemini accepts "parts" arrays where each part can be:
   * - { text: "hello" } for text
   * - { inlineData: { mimeType: "image/jpeg", data: "base64..." } } for images
   */
  private convertMessagesToGeminiFormat(messages: Message[]): GeminiMessage[] {
    return messages
      .map((msg) => {
        const parts: Part[] = [];
        
        // Iterate through content array
        for (const contentPiece of msg.content) {
          if (contentPiece.type === 'text' && contentPiece.text) {
            parts.push({ text: contentPiece.text });
          } else if (contentPiece.type === 'image') {
            if (contentPiece.imageBase64) {
              // Remove data URL prefix if present (data:image/jpeg;base64,)
              const base64Data = contentPiece.imageBase64.includes(',')
                ? contentPiece.imageBase64.split(',')[1]
                : contentPiece.imageBase64;

              parts.push({
                inlineData: {
                  mimeType: contentPiece.mimeType || 'image/jpeg',
                  data: base64Data,
                },
              });
            } else if (contentPiece.imageUrl) {
              // For remote URLs, add text reference (Gemini can't fetch URLs directly)
              parts.push({ 
                text: `[Image URL: ${contentPiece.imageUrl}]` 
              });
            }
          }
        }
        
        return {
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts,
        };
      })
      .filter(msg => msg.parts.length > 0); // Remove messages with no parts
  }
}