import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SparePart } from './entities/spare-part.entity';
import { CreateSparePartDto } from './dto/create-spare-part.dto';
import { UpdateSparePartDto } from './dto/update-spare-part.dto';

@Injectable()
export class SparePartsService {
  constructor(
    @InjectRepository(SparePart)
    private readonly sparePartRepository: Repository<SparePart>,
  ) {}

  async create(createSparePartDto: CreateSparePartDto) {
    const { name } = createSparePartDto;
    const existingPart = await this.sparePartRepository.findOneBy({ name });
    if (existingPart) {
      throw new BadRequestException(
        `Spare part with name ${name} already exists`,
      );
    }
    const sparePart = this.sparePartRepository.create(createSparePartDto);
    return await this.sparePartRepository.save(sparePart);
  }

  async findAll() {
    return await this.sparePartRepository.find({});
  }

  async findOne(id: string) {
    const sparePart = await this.sparePartRepository.findOne({
      where: { id },
    });

    if (!sparePart) {
      throw new NotFoundException(`Spare part with id ${id} not found`);
    }

    return sparePart;
  }

  async update(id: string, updateSparePartDto: UpdateSparePartDto) {
    const existingPart = await this.sparePartRepository.findOneBy({ id });
    if (!existingPart) {
      throw new NotFoundException(`Spare part with id ${id} not found`);
    }

    // Combina los nuevos valores con el registro existente
    const sparePart = await this.sparePartRepository.preload({
      id,
      ...updateSparePartDto,
    });

    if (!sparePart) {
      throw new NotFoundException(`Spare part with id ${id} not found`);
    }

    return await this.sparePartRepository.save(sparePart);
  }

  async remove(id: string) {
    const sparePart = await this.sparePartRepository.findOneBy({ id });
    if (!sparePart) {
      throw new NotFoundException(`Spare part with id ${id} not found`);
    }

    await this.sparePartRepository.remove(sparePart);
  }

  // Decrementar el stock de un repuesto
  async decreaseStock(partId: string, quantity: number): Promise<void> {
    const part = await this.findOne(partId);
    if (part.stock < quantity) {
      throw new BadRequestException(
        `Low stock. Available: ${part.stock}, required: ${quantity}`,
      );
    }
    part.stock -= quantity;
    await this.sparePartRepository.save(part);
  }

  // Incrementar el stock de un repuesto
  async increaseStock(partId: string, quantity: number): Promise<void> {
    const part = await this.findOne(partId);
    part.stock += quantity;
    await this.sparePartRepository.save(part);
  }
}
