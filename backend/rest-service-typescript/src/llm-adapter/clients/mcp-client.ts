import { Injectable, HttpException, HttpStatus, Inject, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { MCPTool } from '../interfaces/chat.types';

interface JsonRpcRequest {
  jsonrpc: '2.0';
  method: string;
  params?: Record<string, any>;
  id: number;
}

interface JsonRpcResponse<T = any> {
  jsonrpc: '2.0';
  result?: T;
  error?: {
    code: number;
    message: string;
  };
  id: number;
}

@Injectable({ scope: Scope.REQUEST })
export class MCPClient {
  private requestId = 1;
  private readonly baseURL: string;

  constructor(
    private readonly httpService: HttpService,
    @Inject(REQUEST) private readonly request: any,
  ) {
    this.baseURL = process.env.MCP_SERVER_URL || 'http://localhost:3001';
  }
  
  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Extract token from current request and pass it to MCP server
    const authHeader = this.request?.headers?.authorization;
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    return headers;
  }

  async listTools(): Promise<MCPTool[]> {
    const request: JsonRpcRequest = {
      jsonrpc: '2.0',
      method: 'tools/list',
      id: this.requestId++,
    };

    try {
      const response$ = this.httpService.post<JsonRpcResponse<MCPTool[]>>(
        `${this.baseURL}/mcp`,
        request,
        { headers: this.getAuthHeaders() }
      );
      
      const response = await firstValueFrom(response$);

      if (response.data.error) {
        throw new Error(`MCP Error: ${response.data.error.message}`);
      }
      
      return response.data.result || [];
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Error fetching MCP tools:', errorMessage);
      throw new HttpException(
        'Failed to fetch tools from MCP server',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async callTool(toolName: string, args: Record<string, any>): Promise<unknown> {
    const request: JsonRpcRequest = {
      jsonrpc: '2.0',
      method: 'tools/call',
      params: {
        name: toolName,
        arguments: args,
      },
      id: this.requestId++,
    };

    try {
      const response$ = this.httpService.post<JsonRpcResponse>(
        `${this.baseURL}/mcp`,
        request,
        { headers: this.getAuthHeaders() }
      );
      
      const response = await firstValueFrom(response$);

      if (response.data.error) {
        throw new Error(`Tool Error: ${response.data.error.message}`);
      }

      return response.data.result as unknown;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.error(`❌ Error calling tool ${toolName}:`, errorMessage);
      throw new HttpException(
        `Failed to execute tool: ${toolName}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
