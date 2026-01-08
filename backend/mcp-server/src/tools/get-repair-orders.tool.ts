import { BackendClient } from '../services/backend-client';
import { McpTool } from '../types/jsonrpc.types';

export const getRepairOrdersTool: McpTool = {
  name: 'get_repair_orders',
  description: 'Retrieve all repair orders for a specific equipment by its ID. Requires authentication (USER, TECHNICIAN, or ADMIN role). Returns complete order details including problem description, status, dates, services, parts, costs, and assigned technicians. Includes summary statistics.',
  inputSchema: {
    type: 'object',
    properties: {
      equipmentId: {
        type: 'string',
        description: 'The unique ID of the equipment (UUID format).',
      },
    },
    required: ['equipmentId'],
  },
};

export async function getRepairOrdersHandler(
  params: { equipmentId: string },
  backendClient: BackendClient,
) {
  console.log(`📋 Getting repair orders for: ${params.equipmentId}`);

  try {
    const repairOrders = await backendClient.getRepairOrdersByEquipment(params.equipmentId);

    if (!repairOrders || repairOrders.length === 0) {
      return {
        success: true,
        message: `No repair orders found for equipment ${params.equipmentId}`,
        repairOrders: [],
        summary: { total: 0, inRepair: 0, completed: 0 },
      };
    }

    const summary = {
      total: repairOrders.length,
      inRepair: repairOrders.filter((o: any) => o.status === 'IN_REPAIR').length,
      completed: repairOrders.filter((o: any) => o.status === 'COMPLETED').length,
      pending: repairOrders.filter((o: any) => o.status === 'PENDING').length,
    };

    return {
      success: true,
      message: `Found ${repairOrders.length} repair order(s)`,
      repairOrders,
      summary,
    };

  } catch (error: any) {
    return {
      success: false,
      message: 'Error getting repair orders',
      error: error.message,
    };
  }
}