import { BackendClient } from '../services/backend-client';
import { McpTool } from '../types/jsonrpc.types';

export const createRepairOrderTool: McpTool = {
  name: 'create_repair_order',
  description: 'Creates a new repair order for a specific equipment owned by the authenticated user. Requires USER role authentication. Automatically updates equipment status to "IN_REPAIR". Optionally accepts image URLs of the damage. The equipment must be in AVAILABLE status.',
  inputSchema: {
    type: 'object',
    properties: {
      equipmentId: {
        type: 'string',
        description: 'Unique ID of the equipment that needs repair (UUID format).',
      },
      problemDescription: {
        type: 'string',
        description: 'Detailed description of the problem, malfunction, or damage reported by the user (e.g., "Screen not turning on", "Coffee spilled on keyboard").',
      },
      imageUrls: {
        type: 'array',
        items: {
          type: 'string',
        },
        description: 'Optional array of image URLs showing the equipment damage or problem. Images should be publicly accessible URLs.',
      },
    },
    required: ['equipmentId', 'problemDescription'],
  },
};

export async function createRepairOrderHandler(
  params: {
    equipmentId: string;
    problemDescription: string;
    imageUrls?: string[];
  },
  backendClient: BackendClient,
) {

  try {
    // Step 1: Verify equipment exists
    console.log('Verifying equipment exists...');
    const equipment = await backendClient.getEquipmentById(params.equipmentId);
    
    if (!equipment) {
      return {
        success: false,
        message: `Equipment with ID ${params.equipmentId} not found`,
      };
    }

    console.log(`✅ Equipment found: ${equipment.name}`);

    // Step 2: Create repair order
    console.log('Creating repair order...');
    const repairOrder = await backendClient.createRepairOrder({
      equipmentId: params.equipmentId,
      problemDescription: params.problemDescription,
      imageUrls: params.imageUrls || [],
    });

    // Step 3: Update equipment status to IN_REPAIR
    await backendClient.updateEquipmentStatus(params.equipmentId, 'IN_REPAIR');
    
    return {
      success: true,
      message: `✅ Repair order successfully created for ${equipment.name}`,
      repairOrder: {
        id: repairOrder.id,
        equipmentId: repairOrder.equipmentId,
        equipmentName: equipment.name,
        problemDescription: repairOrder.problemDescription,
        status: repairOrder.status,
        createdAt: repairOrder.createdAt,
      },
    };

  } catch (error: any) {
    console.error(`❌ Error creating repair order: ${error.message}`);
    
    return {
      success: false,
      message: 'Error creating repair order',
      error: error.message,
    };
  }
}