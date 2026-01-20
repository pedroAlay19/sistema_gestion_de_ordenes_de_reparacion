import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ToolRegistry } from './tools/registry';
import { Logger } from './services/logger.service';
import {
  JsonRpcRequest,
  JsonRpcResponse,
  JsonRpcErrorCodes,
} from './types/jsonrpc.types';
dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middlewares
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Inicializar registry de tools
const toolRegistry = new ToolRegistry();

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'mcp-server',
    timestamp: new Date().toISOString(),
    toolsCount: toolRegistry.getAllTools().length,
  });
});

/**
 * Endpoint principal JSON-RPC
 */
app.post('/mcp', async (req: Request, res: Response) => {
  const request: JsonRpcRequest = req.body;
  const startTime = Date.now();
  
  // Log de entrada
  Logger.log({
    type: 'request',
    method: request.method,
    params: request.params,
    ip: req.ip
  });
  
  // Validar formato JSON-RPC
  if (request.jsonrpc !== '2.0' || !request.method) {
    Logger.log({
      type: 'error',
      method: request.method || 'unknown',
      error: 'Solicitud JSON-RPC inválida'
    });
    
    return res.json(
      createErrorResponse(
        request.id || null,
        JsonRpcErrorCodes.INVALID_REQUEST,
        'Solicitud JSON-RPC inválida'
      )
    );
  }

  // Extraer token de autenticación del header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    toolRegistry.setAuthToken(token);
    console.log('🔐 Token de autenticación configurado');
  } else {
    console.warn('⚠️  No se proporcionó token de autenticación');
    toolRegistry.clearAuthToken();
  }

  try {
    let result: any;

    switch (request.method) {
      case 'tools/list':
        // Listar todos los tools disponibles
        result = toolRegistry.getAllTools();
        console.log(`📋 Listando ${result.length} tools`);
        
        Logger.log({
          type: 'success',
          method: 'tools/list',
          toolCount: result.length,
          executionTimeMs: Date.now() - startTime
        });
        break;

      case 'tools/call':
        // Ejecutar un tool específico
        const { name, arguments: args } = request.params || {};

        if (!name) {
          return res.json(
            createErrorResponse(
              request.id,
              JsonRpcErrorCodes.INVALID_PARAMS,
              'Se requiere el nombre del tool'
            )
          );
        }

        if (!toolRegistry.hasTool(name)) {
          return res.json(
            createErrorResponse(
              request.id,
              JsonRpcErrorCodes.METHOD_NOT_FOUND,
              `Tool "${name}" no encontrado`
            )
          );
        }

        console.log(`🔧 Ejecutando tool: ${name}`);
        result = await toolRegistry.executeTool(name, args || {});
        console.log(`✅ Tool ejecutado:`, result);
        
        Logger.log({
          type: 'success',
          method: 'tools/call',
          toolName: name,
          args: args,
          executionTimeMs: Date.now() - startTime
        });
        break;

      default:
        return res.json(
          createErrorResponse(
            request.id,
            JsonRpcErrorCodes.METHOD_NOT_FOUND,
            `Método "${request.method}" no encontrado`
          )
        );
    }

    // Respuesta exitosa
    const response = createSuccessResponse(request.id, result);
    console.log('📤 JSON-RPC Response:', JSON.stringify(response, null, 2));
    res.json(response);

  } catch (error: any) {
    console.error('❌ MCP Server Error:', error);
    
    Logger.log({
      type: 'error',
      method: request.method,
      toolName: request.params?.name,
      error: error.message,
      executionTimeMs: Date.now() - startTime
    });
    
    res.json(
      createErrorResponse(
        request.id,
        JsonRpcErrorCodes.INTERNAL_ERROR,
        error.message
      )
    );
  }
});

// Funciones helper
function createSuccessResponse(id: string | number, result: any): JsonRpcResponse {
  return {
    jsonrpc: '2.0',
    result,
    id,
  };
}

function createErrorResponse(
  id: string | number | null,
  code: number,
  message: string
): JsonRpcResponse {
  return {
    jsonrpc: '2.0',
    error: { code, message },
    id: id || 0,
  };
}

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`   MCP Server corriendo en puerto ${PORT}`);
  console.log(`   📋 Tools disponibles: ${toolRegistry.getAllTools().length}`);
  console.log(`   🔗 Endpoint: http://localhost:${PORT}/mcp`);
});