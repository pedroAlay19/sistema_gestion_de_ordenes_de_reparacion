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
import { OrderRepairStatus } from './entities/enum/order-repair.enum';
import { UpdateRepairOrderDto } from './dto/update-repair-order.dto';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { UserRole } from '../users/entities/enums/user-role.enum';
import { UsersService } from '../users/users.service';

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

    private readonly httpService: HttpService,
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

    try {
      await firstValueFrom(
        this.httpService.post('http://localhost:8081/notify', {
          type: 'repair_order',
          action: 'created',
          id: savedOrder.id,
        }),
      );
      console.log('Notificación enviada al WebSocket Go');
    } catch (error) {
      console.error('Error notificando al WebSocket Go:', error.message);
    }
    return { savedOrder };
  }

  async findAllByRole(user: JwtPayload) {
    switch (user.role) {
      case UserRole.ADMIN: {
        return await this.repairOrderRepository.find({
          relations: ['repairOrderDetails', 'repairOrderParts'],
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
          relations: ['repairOrderDetails', 'repairOrderDetails.service', 'repairOrderDetails.technician', 'repairOrderParts', 'repairOrderParts.part', 'equipment'],
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
    await this.notificationService.create(repairOrder, newStatus);

    try {
      await firstValueFrom(
        this.httpService.post('http://localhost:8081/notify', {
          type: 'repair_order_status',
          action: 'updated',
          id: repairOrder.id,
          newStatus,
        }),
      );
      console.log(`Notificación WS enviada: estado cambiado a ${newStatus}`);
    } catch (error) {
      console.error('Error notificando al WebSocket Go:', error.message);
    }
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
}
