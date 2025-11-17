import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRepairOrderDto } from './dto/create-repair-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RepairOrder } from './entities/repair-order.entity';
import { Repository } from 'typeorm';
import { EquipmentsService } from '../equipments/equipments.service';
import { RepairOrderDetailsService } from './services/repair-order-details.service';
import { RepairOrderPartsService } from './services/repair-order-parts.service';
import { NotificationService } from './services/notification.service';
import { OrderRepairStatus, TicketServiceStatus } from './entities/enum/order-repair.enum';
import { UpdateRepairOrderDto } from './dto/update-repair-order.dto';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { UserRole } from '../users/entities/enums/user-role.enum';
import { UsersService } from '../users/users.service';
import { WebSocketNotificationService } from '../websocket/websocket-notification.service';
import { EquipmentStatus } from '../equipments/entities/enums/equipment.enum';

@Injectable()
export class RepairOrdersService {
  constructor(
    @InjectRepository(RepairOrder)
    private readonly repairOrderRepository: Repository<RepairOrder>,

    private readonly equipmentsService: EquipmentsService,

    private readonly repairOrderDetailsService: RepairOrderDetailsService,

    private readonly repairOrderPartsService: RepairOrderPartsService,

    private readonly notificationService: NotificationService,

    private readonly usersService: UsersService,

    private readonly wsNotificationService: WebSocketNotificationService,
  ) {}

  async create(createRepairOrderDto: CreateRepairOrderDto) {
    const equipmentFound = await this.equipmentsService.findOneById(
      createRepairOrderDto.equipmentId,
    );

    const evaluatorTechnician =
      await this.usersService.findTechnicianEvaluator();

    // Crear la orden principal
    const repairOrder = this.repairOrderRepository.create({
      ...createRepairOrderDto,
      equipment: equipmentFound,
      evaluatedBy: evaluatorTechnician,
      finalCost: 0,
    });
    const savedOrderRepair = await this.repairOrderRepository.save(repairOrder);
    let totalDetails = 0;
    let totalParts = 0;

    // Crear los detalles asociados
    if (createRepairOrderDto.details?.length) {
      const details = await this.repairOrderDetailsService.create(
        createRepairOrderDto.details,
        savedOrderRepair,
      );
      totalDetails = details.reduce((sum, d) => sum + Number(d.subTotal), 0);
      savedOrderRepair.repairOrderDetails = details;
    }
    // Crear las piezas asociadas
    if (createRepairOrderDto.parts?.length) {
      const parts = await this.repairOrderPartsService.create(
        createRepairOrderDto.parts,
        savedOrderRepair,
      );
      totalParts = parts.reduce((sum, p) => sum + Number(p.subTotal), 0);
      savedOrderRepair.repairOrderParts = parts;
    }

    const finalCost = totalDetails + totalParts;

    // Actualizar la orden con el costo final
    savedOrderRepair.finalCost = finalCost;
    savedOrderRepair.finalCost = finalCost;
    const savedOrder = await this.repairOrderRepository.save(savedOrderRepair);

    await this.notificationService.create(
      savedOrder,
      OrderRepairStatus.IN_REVIEW,
    );

    // Notificar creación de orden - Actualiza: overview, by-status, recent, counts
    await this.wsNotificationService.notifyDashboardUpdate(
      'REPAIR_ORDER_CREATED',
      savedOrder.id,
    );

    return { savedOrder };
  }

  async findAllByRole(user: JwtPayload) {
    switch (user.role) {
      case UserRole.ADMIN: {
        return await this.repairOrderRepository.find({
          relations: [
            'repairOrderDetails',
            'repairOrderParts',
            'equipment.user',
            'evaluatedBy',
          ],
          order: { createdAt: 'DESC' },
        });
      }

      case UserRole.TECHNICIAN: {
        return await this.repairOrderRepository.find({
          where: { repairOrderDetails: { technician: { id: user.sub } } },
          relations: ['repairOrderDetails', 'repairOrderParts'],
        });
      }
      case UserRole.USER: {
        return await this.repairOrderRepository.find({
          where: { equipment: { user: { id: user.sub } } },
          relations: ['equipment', 'repairOrderDetails', 'repairOrderParts'],
        });
      }
      default:
        throw new ForbiddenException('Invalid user role');
    }
  }

  async findByEvaluator(technicianId: string) {
    return await this.repairOrderRepository.find({
      where: { evaluatedBy: { id: technicianId } },
      relations: ['repairOrderDetails', 'repairOrderParts', 'equipment'],
    });
  }

  async findDetailsByTechnician(technicianId: string) {
    const details = await this.repairOrderDetailsService.findByTechnician(technicianId);
    return details;
  }

  async updateDetailStatus(detailId: string, technicianId: string, status: TicketServiceStatus, notes?: string) {
    return await this.repairOrderDetailsService.updateStatus(detailId, technicianId, status, notes);
  }

  async updateDetailByTechnician(
    detailId: string,
    technicianId: string,
    updateData: {
      status: TicketServiceStatus;
      unitPrice: number;
      discount?: number;
      imageUrl?: string;
      notes?: string;
    },
  ) {
    const result = await this.repairOrderDetailsService.updateByTechnician(detailId, technicianId, updateData);
    
    // Recalcular el finalCost de la orden
    const repairOrder = await this.repairOrderRepository.findOne({
      where: { id: result.repairOrderId },
      relations: ['repairOrderDetails', 'repairOrderParts'],
    });

    if (repairOrder) {
      const totalDetails = repairOrder.repairOrderDetails?.reduce(
        (sum, d) => sum + Number(d.subTotal),
        0,
      ) ?? 0;

      const totalParts = repairOrder.repairOrderParts?.reduce(
        (sum, p) => sum + Number(p.subTotal),
        0,
      ) ?? 0;

      repairOrder.finalCost = totalDetails + totalParts;
      await this.repairOrderRepository.save(repairOrder);
    }
    
    return result.detail;
  }

  async findOne(id: string, user: JwtPayload) {
    switch (user.role) {
      case UserRole.ADMIN: {
        return await this.repairOrderRepository.findOne({
          where: { id },
          relations: [
            'equipment',
            'repairOrderDetails',
            'repairOrderParts',
            'evaluatedBy',
          ],
        });
      }
      case UserRole.TECHNICIAN: {
        const order = await this.repairOrderRepository.findOne({
          where: [
            { id, repairOrderDetails: { technician: { id: user.sub } } },
            { id, evaluatedBy: { id: user.sub } },
          ],
          relations: [
            'repairOrderDetails',
            'repairOrderDetails.service',
            'repairOrderDetails.technician',
            'repairOrderParts',
            'repairOrderParts.part',
            'equipment',
          ],
        });
        return order;
      }
      case UserRole.USER: {
        const order = await this.repairOrderRepository.findOne({
          where: { id, equipment: { user: { id: user.sub } } },
          relations: ['equipment', 'repairOrderDetails', 'repairOrderParts'],
        });
        if (!order) {
          throw new ForbiddenException(
            `You do not have access to this repair order.`,
          );
        }
        return order;
      }
      default:
        throw new ForbiddenException('Invalid user role');
    }
  }

  async update(
    id: string,
    updateRepairOrderDto: UpdateRepairOrderDto,
    user: JwtPayload,
  ) {
    const repairOrder = await this.findOne(id, user);
    if (!repairOrder)
      throw new NotFoundException(`Repair order with ID ${id} not found.`);
    const previousStatus = repairOrder.status;

    this.updateBasicInfo(repairOrder, updateRepairOrderDto);
    await this.handleStatusChange(
      repairOrder,
      updateRepairOrderDto.status,
      previousStatus,
    );
    this.updateWarrantyDates(repairOrder, updateRepairOrderDto);

    // Actualizar detalles (servicios de mantenimiento)
    if (updateRepairOrderDto.details?.length) {
      repairOrder.repairOrderDetails =
        await this.repairOrderDetailsService.updateMany(
          updateRepairOrderDto.details,
          repairOrder,
        );
    }

    // Actualizar las piezas del mantenimiento
    if (updateRepairOrderDto.parts?.length) {
      repairOrder.repairOrderParts =
        await this.repairOrderPartsService.updateMany(
          updateRepairOrderDto.parts,
          repairOrder,
        );
    }

    repairOrder.finalCost = await this.recalculateFinalCost(
      repairOrder.id,
      user,
    );
    return await this.repairOrderRepository.save(repairOrder);
  }

  async remove(id: string, user: JwtPayload) {
    const repairOrder = await this.findOne(id, user);
    if (!repairOrder)
      throw new NotFoundException(`Repair order with ID ${id} not found.`);
    await this.repairOrderRepository.remove(repairOrder);
  }

  // Funciones privadas auxiliares

  private updateBasicInfo(repairOrder: RepairOrder, dto: UpdateRepairOrderDto) {
    if (dto.problemDescription)
      repairOrder.problemDescription = dto.problemDescription;

    if (dto.diagnosis) repairOrder.diagnosis = dto.diagnosis;

    if (dto.estimatedCost) repairOrder.estimatedCost = dto.estimatedCost;
  }

  private async handleStatusChange(
    repairOrder: RepairOrder,
    newStatus?: OrderRepairStatus,
    previousStatus?: OrderRepairStatus,
  ) {
    if (!newStatus || newStatus === previousStatus) return;
    repairOrder.status = newStatus;
    
    // Actualizar estado del equipo según el estado de la orden
    await this.updateEquipmentStatus(repairOrder, newStatus);
    
    // Generar fechas de garantía cuando se entrega
    if (newStatus === OrderRepairStatus.DELIVERED) {
      this.generateWarrantyDates(repairOrder);
    }
    
    await this.notificationService.create(repairOrder, newStatus);
  }

  private async updateEquipmentStatus(
    repairOrder: RepairOrder,
    newStatus: OrderRepairStatus,
  ) {
    const equipment = await this.equipmentsService.findOneById(
      repairOrder.equipment.id,
    );

    if (!equipment) return;

    // Cuando la orden pasa a IN_REPAIR, el equipo debe estar en IN_REPAIR
    if (newStatus === OrderRepairStatus.IN_REPAIR) {
      await this.equipmentsService.updateStatus(
        equipment.id,
        EquipmentStatus.IN_REPAIR,
      );
    }
    
    // Cuando la orden se entrega, el equipo vuelve a estar AVAILABLE
    if (newStatus === OrderRepairStatus.DELIVERED) {
      await this.equipmentsService.updateStatus(
        equipment.id,
        EquipmentStatus.AVAILABLE,
      );
    }
  }

  private generateWarrantyDates(repairOrder: RepairOrder) {
    // Si ya tiene fechas de garantía, no las sobrescribimos
    if (repairOrder.warrantyStartDate && repairOrder.warrantyEndDate) return;

    const today = new Date();
    const warrantyEnd = new Date();
    
    // Garantía de 3 meses desde hoy
    warrantyEnd.setMonth(warrantyEnd.getMonth() + 3);

    repairOrder.warrantyStartDate = today;
    repairOrder.warrantyEndDate = warrantyEnd;
  }

  private updateWarrantyDates(
    repairOrder: RepairOrder,
    dto: UpdateRepairOrderDto,
  ) {
    const { warrantyStartDate, warrantyEndDate } = dto;

    if (!warrantyStartDate || !warrantyEndDate) return;

    const start = new Date(warrantyStartDate);
    const end = new Date(warrantyEndDate);

    if (start >= end) {
      throw new BadRequestException(
        'Warranty start date must be earlier than the end date.',
      );
    }
    repairOrder.warrantyStartDate = start;
    repairOrder.warrantyEndDate = end;
  }

  // Funcion para recalcular el costo final de un RepairOrder
  private async recalculateFinalCost(
    orderId: string,
    user: JwtPayload,
  ): Promise<number> {
    const orderRepair = await this.findOne(orderId, user);
    if (!orderRepair)
      throw new NotFoundException(`Repair order with ID ${orderId} not found.`);
    const totalDetails =
      orderRepair.repairOrderDetails?.reduce(
        (sum, d) => sum + Number(d.subTotal),
        0,
      ) ?? 0;

    const totalParts =
      orderRepair.repairOrderParts?.reduce(
        (sum, p) => sum + Number(p.subTotal),
        0,
      ) ?? 0;

    const finalCost = totalDetails + totalParts;
    return finalCost;
  }


  async getOrdersOverview() {
    const [totalOrders, activeOrders, rejectedOrders, completedOrders] =
      await Promise.all([
        this.repairOrderRepository.count(),
        this.repairOrderRepository.count({
          where: [
            { status: OrderRepairStatus.IN_REVIEW },
            { status: OrderRepairStatus.WAITING_APPROVAL },
            { status: OrderRepairStatus.IN_REPAIR },
            { status: OrderRepairStatus.WAITING_PARTS },
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
      select: ['finalCost'],
    });

    const totalRevenue = completedOrders.reduce(
      (sum, o) => sum + Number(o.finalCost || 0),
      0,
    );

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

  async getRecentOrders(limit: number = 10) {
    const orders = await this.repairOrderRepository.find({
      relations: ['equipment', 'equipment.user'],
      order: { createdAt: 'DESC' },
      take: limit,
      select: {
        id: true,
        problemDescription: true,
        status: true,
        createdAt: true,
        finalCost: true,
        equipment: {
          name: true,
          user: {
            name: true,
          },
        },
      },
    });

    const recentOrders = orders.map((o) => ({
      id: o.id,
      problemDescription: o.problemDescription,
      status: o.status,
      clientName: o.equipment?.user?.name,
      equipmentName: o.equipment?.name,
      createdAt: o.createdAt,
      finalCost: o.finalCost,
    }));

    return { recentOrders };
  }


  async getTopServices(limit: number = 5) {
    const orders = await this.repairOrderRepository.find({
      relations: ['repairOrderDetails', 'repairOrderDetails.service'],
      select: {
        id: true,
        repairOrderDetails: {
          subTotal: true,
          service: {
            serviceName: true,
          },
        },
      },
    });

    const serviceStats: Record<string, { count: number; revenue: number }> = {};
    orders.forEach((o) => {
      o.repairOrderDetails?.forEach((detail) => {
        const serviceName = detail.service?.serviceName || 'Unknown';
        if (!serviceStats[serviceName]) {
          serviceStats[serviceName] = { count: 0, revenue: 0 };
        }
        serviceStats[serviceName].count++;
        serviceStats[serviceName].revenue += Number(detail.subTotal || 0);
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

  async getTotalOrdersCount() {
    const count = await this.repairOrderRepository.count();
    return { count };
  }

  async getActiveOrdersCount() {
    const count = await this.repairOrderRepository.count({
      where: [
        { status: OrderRepairStatus.IN_REVIEW },
        { status: OrderRepairStatus.WAITING_APPROVAL },
        { status: OrderRepairStatus.IN_REPAIR },
        { status: OrderRepairStatus.WAITING_PARTS },
        { status: OrderRepairStatus.READY },
      ],
    });
    return { count };
  }

  async getTotalRevenue() {
    const completedOrders = await this.repairOrderRepository.find({
      where: { status: OrderRepairStatus.DELIVERED },
      select: ['finalCost'],
    });

    const total = completedOrders.reduce(
      (sum, o) => sum + Number(o.finalCost || 0),
      0,
    );

    return { revenue: Math.round(total * 100) / 100 };
  }
}
