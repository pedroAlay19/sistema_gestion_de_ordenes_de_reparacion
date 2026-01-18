import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRepairOrderDto } from './dto/create-repair-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RepairOrder } from './entities/repair-order.entity';
import { DataSource, Repository } from 'typeorm';
import { EquipmentsService } from '../equipments/equipments.service';
import { RepairOrderDetailsService } from './services/repair-order-details.service';
import { RepairOrderPartsService } from './services/repair-order-parts.service';
import {
  OrderRepairStatus,
  TicketServiceStatus,
} from './entities/enum/order-repair.enum';
import {
  AssignRepairWorkDto,
  EvaluateRepairOrderDto,
} from './dto/update-repair-order.dto';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { UserRole } from '../users/entities/enums/user-role.enum';
import { UsersService } from '../users/users.service';
import { EquipmentStatus } from '../equipments/entities/enums/equipment.enum';
import { CreateRepairOrderDetailDto } from './dto/details/create-repair-order-detail.dto';
import { CreateRepairOrderPartDto } from './dto/parts/create-repair-order-part.dto';
import { WebhooksService } from '../webhooks/webhooks.service';

@Injectable()
export class RepairOrdersService {
  constructor(
    @InjectRepository(RepairOrder)
    private readonly repairOrderRepository: Repository<RepairOrder>,

    private readonly equipmentsService: EquipmentsService,

    private readonly repairOrderDetailsService: RepairOrderDetailsService,

    private readonly repairOrderPartsService: RepairOrderPartsService,

    private readonly usersService: UsersService,

    private readonly dataSource: DataSource,

    private readonly webhooksService: WebhooksService,
  ) {}

  async create(createRepairOrderDto: CreateRepairOrderDto) {
    const equipment = await this.equipmentsService.findOneAvailable(
      createRepairOrderDto.equipmentId,
    );

    // Asignar el tecnico evaluador por defecto
    const evaluator = await this.usersService.findTechnicianEvaluator();

    // Crear la orden principal
    const order = this.repairOrderRepository.create({
      equipment,
      evaluatedBy: evaluator,
      problemDescription: createRepairOrderDto.problemDescription,
      imageUrls: createRepairOrderDto.imageUrls || [],
    });
    const savedOrder = await this.repairOrderRepository.save(order);

    // Notificar a partners externos (cine) sobre la nueva orden
    try {
      await this.webhooksService.notifyPartnersOfEvent('order.created', {
        status: 'created',
      });
    } catch (error) {
      // Log error pero no fallar la creación de la orden
      console.error('Error al enviar webhook:', error);
    }

    return savedOrder;
  }

  async findAllByRole(user: JwtPayload) {
    switch (user.role) {
      case UserRole.ADMIN: {
        return await this.repairOrderRepository.find({
          relations: ['repairOrderDetails', 'repairOrderParts', 'equipment.user'],
          order: { createdAt: 'DESC' },
        });
      }

      case UserRole.TECHNICIAN: {
        return await this.repairOrderRepository.find({
          where: { repairOrderDetails: { technician: { userId: user.sub } } },
          relations: ['repairOrderDetails', 'repairOrderParts'],
        });
      }
      case UserRole.USER: {
        return await this.repairOrderRepository.find({
          where: { equipment: { user: { userId: user.sub } } },
          relations: ['equipment', 'repairOrderDetails', 'repairOrderParts'],
        });
      }
      default:
        throw new ForbiddenException('Invalid user role');
    }
  }

  async findByEquipment(equipmentId: string) {
    return await this.repairOrderRepository.find({
      where: { equipment: { id: equipmentId } },
      relations: ['repairOrderDetails', 'repairOrderDetails.service', 'repairOrderParts', 'repairOrderParts.part', 'repairOrderDetails.technician'],
    });;
  }

  async findOne(id: string, user: JwtPayload) {
    let order: RepairOrder | null;
    switch (user.role) {
      case UserRole.ADMIN:
        order = await this.repairOrderRepository.findOne({
          where: { id },
          relations: ['repairOrderDetails', 'repairOrderParts'],
        });
        break;

      case UserRole.TECHNICIAN:
        order = await this.repairOrderRepository.findOne({
          where: [
            { id, repairOrderDetails: { technician: { userId: user.sub } } },
            { id, evaluatedBy: { userId: user.sub } },
          ],
          relations: ['repairOrderDetails', 'repairOrderParts', 'equipment', 'repairOrderDetails.service', 'repairOrderDetails.technician', 'repairOrderParts.part'],
        });
        break;

      case UserRole.USER:
        order = await this.repairOrderRepository.findOne({
          where: { id, equipment: { user: { userId: user.sub } } },
          relations: ['equipment', 'repairOrderDetails', 'repairOrderParts', 'repairOrderDetails.service', 'repairOrderParts.part', 'repairOrderDetails.technician'],
        });
        break;

      default:
        throw new ForbiddenException('Invalid user role');
    }
    if (!order)
      throw new NotFoundException(`Repair order with ID ${id} not found.`);
    return order;
  }

  async remove(id: string, user: JwtPayload) {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can delete orders');
    }
    const order = await this.findOne(id, user);
    const safeStatesToDelete = [
      OrderRepairStatus.IN_REVIEW,
      OrderRepairStatus.WAITING_APPROVAL,
      OrderRepairStatus.REJECTED,
    ];
    if (!safeStatesToDelete.includes(order.status)) {
      throw new BadRequestException(
        'Cannot delete orders with assigned work (IN_REPAIR, READY, DELIVERED). ' +
          'These orders have inventory movements and cannot be deleted.',
      );
    }
    await this.repairOrderRepository.remove(order);
  }

  // Flujos de estado

  // Paso 1: Tecnico evalua la orden
  async evaluateRepairOrder(
    orderId: string,
    dto: EvaluateRepairOrderDto,
    technicianId: string,
  ): Promise<RepairOrder> {
    const order = await this.repairOrderRepository.findOne({
      where: { id: orderId, evaluatedBy: { userId: technicianId } },
      relations: ['equipment', 'evaluatedBy'],
    });

    if (!order) {
      throw new NotFoundException(
        'Order not found or you are not the assigned evaluator',
      );
    }

    if (order.status !== OrderRepairStatus.IN_REVIEW) {
      throw new BadRequestException(
        'Order must be in IN_REVIEW status to evaluate',
      );
    }

    order.diagnosis = dto.diagnosis;
    order.estimatedCost = dto.estimatedCost;
    order.status = OrderRepairStatus.WAITING_APPROVAL;

    return await this.repairOrderRepository.save(order);
  }

  // Paso 2: Cliente aprueba la orden
  async approveRepairOrder(
    orderId: string,
    userId: string,
  ): Promise<RepairOrder> {
    const order = await this.repairOrderRepository.findOne({
      where: { id: orderId, equipment: { user: { userId: userId } } },
      relations: ['equipment', 'equipment.user'],
    });

    if (!order) {
      throw new NotFoundException('Order not found or not yours');
    }

    if (order.status !== OrderRepairStatus.WAITING_APPROVAL) {
      throw new BadRequestException(
        'Order must be in WAITING_APPROVAL status to approve',
      );
    }

    order.status = OrderRepairStatus.IN_REPAIR;
    order.equipment.currentStatus = EquipmentStatus.IN_REPAIR;
    await this.equipmentsService.updateStatus(order.equipment.id, EquipmentStatus.IN_REPAIR);
    return await this.repairOrderRepository.save(order);
  }

  // Paso 2: Cliente rechaza la orden
  async rejectRepairOrder(
    orderId: string,
    userId: string,
  ): Promise<RepairOrder> {
    const order = await this.repairOrderRepository.findOne({
      where: { id: orderId, equipment: { user: { userId: userId } } },
      relations: ['equipment', 'equipment.user'],
    });

    if (!order) {
      throw new NotFoundException('Order not found or not yours');
    }

    if (order.status !== OrderRepairStatus.WAITING_APPROVAL) {
      throw new BadRequestException(
        'Order must be in WAITING_APPROVAL status to reject',
      );
    }

    order.status = OrderRepairStatus.REJECTED;

    // Liberar el equipo
    await this.equipmentsService.updateStatus(
      order.equipment.id,
      EquipmentStatus.AVAILABLE,
    );

    return await this.repairOrderRepository.save(order);
  }

  // Paso 3: Asignar trabajo (tecnicos y piezas)
  async assignWork(
    orderId: string,
    dto: AssignRepairWorkDto,
  ): Promise<RepairOrder> {
    return await this.dataSource.transaction(async (manager) => {
      const order = await manager.findOne(RepairOrder, {
        where: { id: orderId },
        relations: ['equipment'],
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      if (order.status !== OrderRepairStatus.IN_REPAIR) {
        throw new BadRequestException(
          'Order must be in IN_REPAIR status to assign work',
        );
      }

      // Crear detalles (servicios)
      await this.repairOrderDetailsService.createMany(dto.details, order);

      // Crear partes (si existen)
      if (dto.parts?.length) {
        await this.repairOrderPartsService.createMany(dto.parts, order);
      }
      return order;
    });
  }

  // Paso 4: Reasignar trabajo (eliminar y recrear)
  async reassignWork(
    orderId: string,
    dto: AssignRepairWorkDto,
  ): Promise<RepairOrder> {
    return await this.dataSource.transaction(async (manager) => {
      const order = await manager.findOne(RepairOrder, {
        where: { id: orderId },
        relations: ['repairOrderDetails', 'repairOrderParts'],
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      if (order.status !== OrderRepairStatus.IN_REPAIR) {
        throw new BadRequestException(
          'Can only reassign work for orders in IN_REPAIR status',
        );
      }
      // Eliminar detalles existentes (solo PENDING)
      for (const detail of order.repairOrderDetails || []) {
        if (detail.status !== TicketServiceStatus.PENDING) {
          throw new BadRequestException(
            'Cannot reassign work with tasks already in progress',
          );
        }
        await manager.remove(detail);
      }

      // Eliminar partes existentes (devuelve stock automáticamente)
      for (const part of order.repairOrderParts || []) {
        await this.repairOrderPartsService.remove(part.id);
      }

      // Crear nuevos detalles
      await this.repairOrderDetailsService.createMany(dto.details, order);
      // Crear nuevas partes
      if (dto.parts?.length) {
        await this.repairOrderPartsService.createMany(dto.parts, order);
      }

      return order;
    });
  }

  // Agregar un detalle individual
  async addDetail(
    orderId: string,
    dto: CreateRepairOrderDetailDto,
  ): Promise<void> {
    const order = await this.repairOrderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== OrderRepairStatus.IN_REPAIR) {
      throw new BadRequestException('Order must be in IN_REPAIR status');
    }

    await this.repairOrderDetailsService.createMany([dto], order);
  }

  // Eliminar un detalle individual
  async removeDetail(orderId: string, detailId: string): Promise<void> {
    const order = await this.repairOrderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== OrderRepairStatus.IN_REPAIR) {
      throw new BadRequestException('Order must be in IN_REPAIR status');
    }

    await this.repairOrderDetailsService.remove(detailId);
  }

  // Agregar una pieza individual
  async addPart(orderId: string, dto: CreateRepairOrderPartDto): Promise<void> {
    const order = await this.repairOrderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== OrderRepairStatus.IN_REPAIR) {
      throw new BadRequestException('Order must be in IN_REPAIR status');
    }

    await this.repairOrderPartsService.createMany([dto], order);
  }

  // Eliminar una pieza individual
  async removePart(orderId: string, partId: string): Promise<void> {
    const order = await this.repairOrderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== OrderRepairStatus.IN_REPAIR) {
      throw new BadRequestException('Order must be in IN_REPAIR status');
    }

    await this.repairOrderPartsService.remove(partId);
  }

  // Paso 5: Entregar equipo al cliente READY -> DELIVERED
  async deliver(orderId: string): Promise<RepairOrder> {
    const order = await this.repairOrderRepository.findOne({
      where: { id: orderId },
      relations: ['equipment'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== OrderRepairStatus.READY) {
      throw new BadRequestException('Order must be in READY status to deliver');
    }

    order.status = OrderRepairStatus.DELIVERED;

    // Actualizar estado del equipo a AVAILABLE
    await this.equipmentsService.updateStatus(
      order.equipment.id,
      EquipmentStatus.AVAILABLE,
    );

    return await this.repairOrderRepository.save(order);
  }

  // Ordenes asignadas a evaluador
  async findByEvaluator(technicianId: string) {
    return await this.repairOrderRepository.find({
      where: { evaluatedBy: { id: technicianId } },
      relations: ['repairOrderDetails', 'repairOrderParts', 'equipment'],
    });
  }

  // Detalles de trabajo asignados al tecnico
  async findDetailsByTechnician(technicianId: string) {
    return await this.repairOrderDetailsService.findByTechnician(technicianId);
  }

  // Tecnico actualiza el estado de su tarea
  async updateDetailStatus(
    detailId: string,
    technicianId: string,
    status: TicketServiceStatus,
    notes?: string,
  ) {
    return await this.repairOrderDetailsService.updateStatus(
      detailId,
      technicianId,
      status,
      notes,
    );
  }

  async calculateFinalCost(orderId: string): Promise<number> {
    const order = await this.repairOrderRepository.findOne({
      where: { id: orderId },
      relations: ['repairOrderDetails', 'repairOrderParts'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const detailsCost =
      order.repairOrderDetails?.reduce(
        (sum, d) => sum + Number(d.repairPrice),
        0,
      ) || 0;

    const partsCost =
      order.repairOrderParts?.reduce((sum, p) => sum + Number(p.subTotal), 0) ||
      0;

    return Number((detailsCost + partsCost).toFixed(2));
  }

  // Dashboards y reportes
  async getOrdersOverview() {
    const [totalOrders, activeOrders, rejectedOrders, completedOrders] =
      await Promise.all([
        this.repairOrderRepository.count(),
        this.repairOrderRepository.count({
          where: [
            { status: OrderRepairStatus.IN_REVIEW },
            { status: OrderRepairStatus.WAITING_APPROVAL },
            { status: OrderRepairStatus.IN_REPAIR },
            { status: OrderRepairStatus.READY },
          ],
        }),
        this.repairOrderRepository.count({
          where: { status: OrderRepairStatus.REJECTED },
        }),
        this.repairOrderRepository.count({
          where: { status: OrderRepairStatus.DELIVERED },
        }),
      ]);

    return {
      totalOrders,
      activeOrders,
      rejectedOrders,
      completedOrders,
    };
  }

  async getRevenueStats() {
    const completedOrders = await this.repairOrderRepository.find({
      where: { status: OrderRepairStatus.DELIVERED },
      relations: ['repairOrderDetails', 'repairOrderParts'],
    });

    let totalRevenue = 0;
    for (const order of completedOrders) {
      totalRevenue += await this.calculateFinalCost(order.id);
    }

    const avgCost =
      completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;

    return {
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      averageCost: Math.round(avgCost * 100) / 100,
      completedOrdersCount: completedOrders.length,
    };
  }

  async getOrdersByStatus() {
    const statusCounts = await Promise.all(
      Object.values(OrderRepairStatus).map(async (status) => ({
        status,
        count: await this.repairOrderRepository.count({ where: { status } }),
      })),
    );

    return { ordersByStatus: statusCounts };
  }

  async getTopServices(limit: number = 5) {
    const orders = await this.repairOrderRepository.find({
      relations: ['repairOrderDetails', 'repairOrderDetails.service'],
    });

    const serviceStats: Record<string, { count: number; revenue: number }> = {};

    orders.forEach((o) => {
      o.repairOrderDetails?.forEach((detail) => {
        const serviceName = detail.service?.serviceName || 'Unknown';
        if (!serviceStats[serviceName]) {
          serviceStats[serviceName] = { count: 0, revenue: 0 };
        }
        serviceStats[serviceName].count++;
        serviceStats[serviceName].revenue += Number(detail.repairPrice || 0);
      });
    });

    const topServices = Object.entries(serviceStats)
      .map(([name, stats]) => ({
        serviceName: name,
        count: stats.count,
        revenue: Math.round(stats.revenue * 100) / 100,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);

    return { topServices };
  }
}
