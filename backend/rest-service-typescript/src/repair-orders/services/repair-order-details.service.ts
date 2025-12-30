import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RepairOrderDetail } from '../entities/repair-order-detail.entity';
import { Repository } from 'typeorm';
import { RepairOrder } from '../entities/repair-order.entity';
import { MaintenanceServicesService } from 'src/maintenance-services/maintenance-services.service';
import { UsersService } from 'src/users/users.service';
import { CreateRepairOrderDetailDto } from '../dto/details/create-repair-order-detail.dto';
import {
  TicketServiceStatus,
  OrderRepairStatus,
} from '../entities/enum/order-repair.enum';

@Injectable()
export class RepairOrderDetailsService {
  constructor(
    @InjectRepository(RepairOrderDetail)
    private readonly repairOrderDetailRepository: Repository<RepairOrderDetail>,

    @InjectRepository(RepairOrder)
    private readonly repairOrderRepository: Repository<RepairOrder>,

    private readonly maintenanceServicesService: MaintenanceServicesService,

    private readonly usersService: UsersService,
  ) {}

  async createMany(
    dtos: CreateRepairOrderDetailDto[],
    repairOrder: RepairOrder,
  ): Promise<RepairOrderDetail[]> {
    const details: RepairOrderDetail[] = [];

    for (const dto of dtos) {
      const service = await this.maintenanceServicesService.findOne(
        dto.serviceId,
      );
      const technician = await this.usersService.findOne(dto.technicianId);

      const detail = this.repairOrderDetailRepository.create({
        repairOrder,
        service,
        technician,
        repairPrice: service.basePrice,
        notes: dto?.notes,
      });

      const saved = await this.repairOrderDetailRepository.save(detail);
      details.push(saved);
    }
    return details;
  }

  async findByTechnician(technicianId: string): Promise<RepairOrderDetail[]> {
    return await this.repairOrderDetailRepository.find({
      where: {
        technician: { id: technicianId },
      },
      relations: ['repairOrder.equipment', 'repairOrder.equipment.user', 'service'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(
    detailId: string,
    technicianId: string,
    status: TicketServiceStatus,
    notes?: string,
  ) {
    const detail = await this.repairOrderDetailRepository.findOne({
      where: { id: detailId, technician: { userId: technicianId } },
      relations: ['technician', 'repairOrder'],
    });

    if (!detail) {
      throw new NotFoundException(
        'Detail not found or you are not assigned to it',
      );
    }
    detail.status = status;
    if (notes !== undefined) detail.notes = notes;

    const saved = await this.repairOrderDetailRepository.save(detail);
    // Verificar si la orden debe cambiar a READY
    await this.checkAndUpdateOrderToReady(detail.repairOrder.id);
    return saved;
  }

  async findOne(id: string): Promise<RepairOrderDetail> {
    const detail = await this.repairOrderDetailRepository.findOne({
      where: { id },
    });

    if (!detail) {
      throw new NotFoundException(`Detail with ID ${id} not found`);
    }
    return detail;
  }

  async remove(detailId: string): Promise<void> {
    const detail = await this.findOne(detailId);

    if (detail.status !== TicketServiceStatus.PENDING) {
      throw new BadRequestException(
        'Cannot delete a detail that is not in PENDING status',
      );
    }

    await this.repairOrderDetailRepository.remove(detail);
  }

  private async checkAndUpdateOrderToReady(repairOrderId: string) {
    // Obtener todos los detalles de la orden
    const allDetails = await this.repairOrderDetailRepository.find({
      where: { repairOrder: { id: repairOrderId } },
    });

    if (allDetails.length === 0) return;

    // Verificar si todos están completados
    const allCompleted = allDetails.every(
      (detail) => detail.status === TicketServiceStatus.COMPLETED,
    );

    if (!allCompleted) return;

    // Actualizar el estado de la orden a READY
    const repairOrder = await this.repairOrderRepository.findOne({
      where: { id: repairOrderId },
    });

    if (repairOrder && repairOrder.status === OrderRepairStatus.IN_REPAIR) {
      repairOrder.status = OrderRepairStatus.READY;
      await this.repairOrderRepository.save(repairOrder);
    }
  }
}
