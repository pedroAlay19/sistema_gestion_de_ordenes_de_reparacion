import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RepairOrderPart } from '../entities/repair-order-part.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateRepairOrderPartDto } from '../dto/parts/create-repair-order-part.dto';
import { RepairOrder } from '../entities/repair-order.entity';
import { SparePartsService } from 'src/spare-parts/spare-parts.service';

@Injectable()
export class RepairOrderPartsService {
  constructor(
    @InjectRepository(RepairOrderPart)
    private readonly repairOrderPartsRepository: Repository<RepairOrderPart>,

    private readonly sparePartsService: SparePartsService,

    private readonly dataSource: DataSource,
  ) {}

  async createMany(
    dtos: CreateRepairOrderPartDto[],
    repairOrder: RepairOrder,
  ): Promise<RepairOrderPart[]> {
    return await this.dataSource.transaction(async (manager) => {
      const savedParts: RepairOrderPart[] = [];
      for (const dto of dtos) {
        const sparePart = await this.sparePartsService.findOne(dto.partId);
        if (sparePart.stock < dto.quantity) {
          throw new BadRequestException(
            `Insufficient stock for part ${sparePart.name}. Available: ${sparePart.stock}, Requested: ${dto.quantity}`,
          );
        }

        await this.sparePartsService.decreaseStock(
          sparePart.id,
          dto.quantity,
          manager,
        );

        const entity = this.repairOrderPartsRepository.create({
          repairOrder,
          part: sparePart,
          quantity: dto.quantity,
          unitPrice: sparePart.unitPrice, // Precio historico
        });
        const saved = await manager.save(entity);
        savedParts.push(saved);
      }
      return savedParts;
    });
  }

  async findOne(id: string) {
    const part = await this.repairOrderPartsRepository.findOne({
      where: { id },
      relations: ['part'],
    });
    if (!part)
      throw new NotFoundException(`Repair order part with ${id} not found`);
    return part;
  }

  async findByRepairOrder(repairOrderId: string): Promise<RepairOrderPart[]> {
    return await this.repairOrderPartsRepository.find({
      where: { repairOrder: { id: repairOrderId } },
      relations: ['part'],
    });
  }

  async remove(id: string): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const orderPart = await this.findOne(id);
      await this.sparePartsService.increaseStock(
        orderPart.part.id,
        orderPart.quantity,
        manager,
      );
      await manager.remove(RepairOrderPart, orderPart);
    });
  }

  async calculateTotalCost(repairOrderId: string): Promise<number> {
    const parts = await this.findByRepairOrder(repairOrderId);

    return parts.reduce((total, part) => {
      return total + Number(part.subTotal);
    }, 0);
  }
}
