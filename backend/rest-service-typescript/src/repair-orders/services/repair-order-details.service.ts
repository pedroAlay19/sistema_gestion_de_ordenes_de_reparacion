import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RepairOrderDetail } from '../entities/repair-order-detail.entity';
import { Repository } from 'typeorm';
import { RepairOrder } from '../entities/repair-order.entity';
import { MaintenanceServicesService } from 'src/maintenance-services/maintenance-services.service';
import { UsersService } from 'src/users/users.service';
import { CreateRepairOrderDetailDto } from '../dto/details/create-repair-order-detail.dto';
import { UpdateRepairOrderDetailDto } from '../dto/details/update-repair-order-detail';
import { TicketServiceStatus } from '../entities/enum/order-repair.enum';

@Injectable()
export class RepairOrderDetailsService {
  constructor(
    @InjectRepository(RepairOrderDetail)
    private readonly repairOrderDetailRepository: Repository<RepairOrderDetail>,

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
