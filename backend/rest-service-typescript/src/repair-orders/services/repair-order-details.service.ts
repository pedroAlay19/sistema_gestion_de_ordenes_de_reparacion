import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RepairOrderDetail } from '../entities/repair-order-detail.entity';
import { Repository } from 'typeorm';
import { RepairOrder } from '../entities/repair-order.entity';
import { MaintenanceServicesService } from 'src/maintenance-services/maintenance-services.service';
import { UsersService } from 'src/users/users.service';
import { CreateRepairOrderDetailDto } from '../dto/details/create-repair-order-detail.dto';
import { UpdateRepairOrderDetailDto } from '../dto/details/update-repair-order-detail';
import { TicketServiceStatus, OrderRepairStatus } from '../entities/enum/order-repair.enum';

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

  async create(
    details: CreateRepairOrderDetailDto[],
    repairOrder: RepairOrder,
  ): Promise<RepairOrderDetail[]> {
    const savedDetails: RepairOrderDetail[] = [];

    for (const d of details) {
      const service = await this.maintenanceServicesService.findOne(
        d.serviceId,
      );
      const technician = await this.usersService.findOne(d.technicianId);

      const detail = this.repairOrderDetailRepository.create({
        repairOrder,
        service,
        technician,
        unitPrice: d?.unitPrice,
        discount: d?.discount ?? 0,
        subTotal: (d?.unitPrice ?? 0) - (d?.discount ?? 0),
        status: TicketServiceStatus.PENDING,
        notes: d?.notes,
      });

      savedDetails.push(await this.repairOrderDetailRepository.save(detail));
    }
    return savedDetails;
  }

  async findOne(id: string) {
    const detail = await this.repairOrderDetailRepository.findOne({
      where: { id },
      relations: ['service', 'technician', 'repairOrder'],
    });
    if (!detail)
      throw new NotFoundException(
        `Repair order detail with ID ${id} not found`,
      );
    return detail;
  }

  async findByTechnician(technicianId: string) {
    return await this.repairOrderDetailRepository.find({
      where: { technician: { id: technicianId } },
      relations: ['service', 'repairOrder', 'repairOrder.equipment', 'repairOrder.equipment.user'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(detailId: string, technicianId: string, status: TicketServiceStatus, notes?: string) {
    const detail = await this.repairOrderDetailRepository.findOne({
      where: { id: detailId, technician: { id: technicianId } },
      relations: ['technician', 'repairOrder'],
    });
    
    if (!detail) {
      throw new NotFoundException('Detail not found or you are not assigned to it');
    }

    detail.status = status;
    if (notes !== undefined) detail.notes = notes;
    
    const savedDetail = await this.repairOrderDetailRepository.save(detail);

    // Verificar si todos los detalles de la orden están completados
    await this.checkAndUpdateOrderStatus(detail.repairOrder.id);
    
    return savedDetail;
  }

  async updateByTechnician(
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
    const detail = await this.repairOrderDetailRepository.findOne({
      where: { id: detailId, technician: { id: technicianId } },
      relations: ['technician', 'repairOrder'],
    });
    
    if (!detail) {
      throw new NotFoundException('Detail not found or you are not assigned to it');
    }

    // Actualizar todos los campos
    detail.status = updateData.status;
    detail.unitPrice = updateData.unitPrice;
    detail.discount = updateData.discount ?? 0;
    detail.subTotal = Number(updateData.unitPrice) - Number(updateData.discount ?? 0);
    if (updateData.imageUrl !== undefined) detail.imageUrl = updateData.imageUrl;
    if (updateData.notes !== undefined) detail.notes = updateData.notes;
    
    const savedDetail = await this.repairOrderDetailRepository.save(detail);

    // Verificar si todos los detalles de la orden están completados
    await this.checkAndUpdateOrderStatus(detail.repairOrder.id);
    
    return { detail: savedDetail, repairOrderId: detail.repairOrder.id };
  }

  private async checkAndUpdateOrderStatus(repairOrderId: string) {
    // Obtener todos los detalles de la orden
    const allDetails = await this.repairOrderDetailRepository.find({
      where: { repairOrder: { id: repairOrderId } },
    });

    // Verificar si todos están completados
    const allCompleted = allDetails.length > 0 && 
      allDetails.every(detail => detail.status === TicketServiceStatus.COMPLETED);

    if (allCompleted) {
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

  async update(dto: UpdateRepairOrderDetailDto) {
    if (!dto.id) throw new NotFoundException('ID is required for update');
    const detail = await this.findOne(dto.id);
    
    // Cambiar el servicio de mantenimiento si llega uno nuevo
    if (dto.serviceId) {
      const service = await this.maintenanceServicesService.findOne(
        dto.serviceId,
      );
      detail.service = service;
    }

    // Cambiar el tecnico si llega uno nuevo
    if (dto.technicianId) {
      const technician = await this.usersService.findOneTechnician(
        dto.technicianId,
      );
      detail.technician = technician;
    }
    if (dto.unitPrice !== undefined) detail.unitPrice = dto.unitPrice;
    if (dto.discount !== undefined) detail.discount = dto.discount;
    if (dto.notes !== undefined) detail.notes = dto.notes;
    if (dto.imageUrl !== undefined) detail.imageUrl = dto.imageUrl;
    if (dto.status !== undefined) detail.status = dto.status;

    // Recalcular subtotal
    detail.subTotal = Number(detail.unitPrice) - Number(detail.discount ?? 0);
    return await this.repairOrderDetailRepository.save(detail);
  }

  async updateMany(
    dtos: UpdateRepairOrderDetailDto[],
    repairOrder?: RepairOrder,
  ) {
    const updated: RepairOrderDetail[] = [];
    for (const dto of dtos) {
      // Si el DTO tiene ID, es una actualización
      if (dto.id) {
        updated.push(await this.update(dto));
      }
      // Si no tiene ID, es una creación nueva
      else if (repairOrder) {
        const createDto: CreateRepairOrderDetailDto = {
          serviceId: dto.serviceId!,
          technicianId: dto.technicianId!,
          unitPrice: dto.unitPrice!,
          discount: dto?.discount,
          notes: dto?.notes,
        };
        const created = await this.create([createDto], repairOrder);
        updated.push(...created);
      }
    }
    return updated;
  }
}
