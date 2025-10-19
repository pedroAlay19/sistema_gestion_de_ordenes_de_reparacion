import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRepairOrderDto } from './dto/create-repair-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RepairOrder } from './entities/repair-order.entity';
import { Repository } from 'typeorm';
import { EquipmentsService } from 'src/equipments/equipments.service';
import { RepairOrderDetailsService } from './services/repair-order-details.service';
import { RepairOrderPartsService } from './services/repair-order-parts.service';
import { NotificationService } from './services/notification.service';
import { OrderRepairStatus } from './entities/enum/order-repair.enum';
import { UpdateRepairOrderDto } from './dto/update-repair-order.dto';

@Injectable()
export class RepairOrdersService {
  constructor(
    @InjectRepository(RepairOrder)
    private readonly repairOrderRepository: Repository<RepairOrder>,

    private readonly equipmentsService: EquipmentsService,

    private readonly repairOrderDetailsService: RepairOrderDetailsService,

    private readonly repairOrderPartsService: RepairOrderPartsService,

    private readonly notificationService: NotificationService,
  ) {}

  async create(createRepairOrderDto: CreateRepairOrderDto) {
    // Buscar el equipo
    const equipmentFound = await this.equipmentsService.findOne(
      createRepairOrderDto.equipmentId,
    );

    // Crear la orden principal
    const repairOrder = this.repairOrderRepository.create({
      equipment: equipmentFound,
      problemDescription: createRepairOrderDto.problemDescription,
      diagnosis: createRepairOrderDto.diagnosis,
      estimatedCost: createRepairOrderDto.estimatedCost,
      finalCost: 0,
    });
    const savedOrderRepair = await this.repairOrderRepository.save(repairOrder);

    // Crear los detalles asociados
    const details = await this.repairOrderDetailsService.create(
      createRepairOrderDto.details,
      repairOrder,
    );
    // Crear las piezas asociadas
    const parts = await this.repairOrderPartsService.create(
      createRepairOrderDto.parts,
      repairOrder,
    );

    // Calcular costo total de servicios y partes
    const totalDetails = details.reduce(
      (sum, d) => sum + Number(d.subTotal),
      0,
    );
    const totalParts = parts.reduce((sum, p) => sum + Number(p.subTotal), 0);
    const finalCost = totalDetails + totalParts;

    // Actualizar la orden con el costo final
    savedOrderRepair.finalCost = finalCost;
    await this.repairOrderRepository.save(savedOrderRepair);

    await this.notificationService.create(
      savedOrderRepair,
      OrderRepairStatus.OPEN,
    );

    return {
      ...savedOrderRepair,
      details,
      parts,
    };
  }

  async findAll() {
    return await this.repairOrderRepository.find();
  }

  async findOne(id: string) {
    const repairOrder = await this.repairOrderRepository.findOne({
      where: { id },
      relations: ['repairOrderDetails', 'repairOrderParts'],
    });
    if (!repairOrder)
      throw new NotFoundException(`Repair order with ${id} not found`);
    return repairOrder;
  }

  async update(id: string, updateRepairOrderDto: UpdateRepairOrderDto) {
    const repairOrder = await this.findOne(id);
    // Actualizar datos basicos de la orden
    if (updateRepairOrderDto.problemDescription)
      repairOrder.problemDescription = updateRepairOrderDto.problemDescription;
    if (updateRepairOrderDto.diagnosis)
      repairOrder.diagnosis = updateRepairOrderDto.diagnosis;
    if (updateRepairOrderDto.estimatedCost)
      repairOrder.estimatedCost = updateRepairOrderDto.estimatedCost;
    if (updateRepairOrderDto.status) {
      repairOrder.status = updateRepairOrderDto.status;
      await this.notificationService.create(
        repairOrder,
        updateRepairOrderDto.status,
      );
    }
    if (
      updateRepairOrderDto.warrantyStartDate &&
      updateRepairOrderDto.warrantyEndDate
    ) {
      repairOrder.warrantyStartDate = updateRepairOrderDto.warrantyStartDate;
      repairOrder.warrantyEndDate = updateRepairOrderDto.warrantyEndDate;
    }

    // Actualizar detalles (servicios de mantenimiento)
    if (
      updateRepairOrderDto.details &&
      updateRepairOrderDto.details.length > 0
    ) {
      const updatedDetails = await this.repairOrderDetailsService.updateMany(
        updateRepairOrderDto.details,
      );
      repairOrder.repairOrderDetails = updatedDetails;
    }

    // Actualizar las piezas del mantenimiento
    if (updateRepairOrderDto.parts && updateRepairOrderDto.parts.length > 0) {
      const updatedParts = await this.repairOrderPartsService.updateMany(
        updateRepairOrderDto.parts,
      );
      repairOrder.repairOrderParts = updatedParts;
    }

    repairOrder.finalCost = await this.recalculateFinalCost(repairOrder.id);
    return await this.repairOrderRepository.save(repairOrder);
  }

  async remove(id: string) {
    const repairOrder = await this.findOne(id);
    await this.repairOrderRepository.remove(repairOrder)
  }

  // Funcion para recalcular el costo final de un RepairOrder
  private async recalculateFinalCost(orderId: string): Promise<number> {
    const orderRepair = await this.findOne(orderId);

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
