import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RepairOrderPart } from '../entities/repair-order-part.entity';
import { Repository } from 'typeorm';
import { CreateRepairOrderPartDto } from '../dto/parts/create-repair-order-part.dto';
import { RepairOrder } from '../entities/repair-order.entity';
import { SparePartsService } from 'src/spare-parts/spare-parts.service';
import { UpdateRepairOrderPartDto } from '../dto/parts/update-repair-order-part.dto';

@Injectable()
export class RepairOrderPartsService {
  constructor(
    @InjectRepository(RepairOrderPart)
    private readonly repairOrderPartsRepository: Repository<RepairOrderPart>,

    private readonly sparePartsService: SparePartsService,
  ) {}

  async create(
    parts: CreateRepairOrderPartDto[],
    repairOrder: RepairOrder,
  ): Promise<RepairOrderPart[]> {
    const savedParts: RepairOrderPart[] = [];

    for (const p of parts) {
      const sparePart = await this.sparePartsService.findOne(p.partId);
      // Reducir el stock de la pieza
      await this.sparePartsService.decreaseStock(sparePart.id, p.quantity);

      const entity = this.repairOrderPartsRepository.create({
        repairOrder,
        part: sparePart,
        quantity: p.quantity,
        subTotal: p.quantity * Number(sparePart.unitPrice),
        imgUrl: p?.imgUrl ?? undefined,
      });
      savedParts.push(await this.repairOrderPartsRepository.save(entity));
    }
    return savedParts;
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

  async update(dto: UpdateRepairOrderPartDto) {
    if (!dto.id)
      throw new NotFoundException('ID is required for updating a repair order part');
    const repairOrderPart = await this.findOne(dto.id);
    const oldPart = repairOrderPart.part;
    const oldQuantity = repairOrderPart.quantity;
    const newQuantity = dto.quantity ?? oldQuantity;

    // Si quantity fue enviado
    if (dto.quantity !== undefined && newQuantity < 1)
      throw new BadRequestException('The quantity must be greater than zero');
    // Si el cliente envio otra pieza diferente
    if (dto.partId && dto.partId !== oldPart.id) {
      const newPart = await this.sparePartsService.findOne(dto.partId);

      // Devolver el stock del repuesto anterior
      await this.sparePartsService.increaseStock(oldPart.id, oldQuantity);
      await this.sparePartsService.decreaseStock(newPart.id, newQuantity);
      repairOrderPart.part = newPart;
      repairOrderPart.quantity = newQuantity;
    } else {
      const diff = newQuantity - oldQuantity;
      if (diff > 0) {
        await this.sparePartsService.decreaseStock(oldPart.id, diff);
      } else if (diff < 0) {
        await this.sparePartsService.increaseStock(oldPart.id, Math.abs(diff));
      }
      repairOrderPart.quantity = newQuantity;
    }

    if (dto.imgUrl !== undefined) repairOrderPart.imgUrl = dto.imgUrl;

    // Actualizar el calculo del subtotal en caso de que la cantidad o la pieza haya cambiado
    repairOrderPart.subTotal = repairOrderPart.quantity * Number(repairOrderPart.part.unitPrice);
    return await this.repairOrderPartsRepository.save(repairOrderPart);
  }

  async updateMany(dtos: UpdateRepairOrderPartDto[], repairOrder?: RepairOrder) {
    const updatedParts: RepairOrderPart[] = [];
    for (const dto of dtos) {
      // Si el DTO tiene ID, es una actualización
      if (dto.id) {
        const updated = await this.update(dto);
        if (updated) updatedParts.push(updated);
      }
      // Si no tiene ID, es una creación nueva
      else if (repairOrder) {
        const createDto: CreateRepairOrderPartDto = {
          partId: dto.partId!,
          quantity: dto.quantity!,
          imgUrl: dto.imgUrl,
        };
        const created = await this.create([createDto], repairOrder);
        updatedParts.push(...created);
      }
    }
    return updatedParts;
  }
}
