import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { SparePart } from './entities/spare-part.entity';
import { CreateSparePartDto } from './dto/create-spare-part.dto';
import { UpdateSparePartDto } from './dto/update-spare-part.dto';
import { sparePartsSeed } from './seeds/spare-parts.seed';

@Injectable()
export class SparePartsService implements OnModuleInit {
    private readonly logger = new Logger(SparePartsService.name);
  
  constructor(
    @InjectRepository(SparePart)
    private readonly sparePartRepository: Repository<SparePart>,
  ) {}

  async onModuleInit() {
    await this.seedSpareParts();
  }

  private async seedSpareParts() {
      try {
        const count = await this.sparePartRepository.count();
  
        if (count === 0) {
          this.logger.log(
            '🌱 No hay repuestos. Ejecutando semilla...',
          );
  
          let successCount = 0;
          let errorCount = 0;
  
          for (const sparePart of sparePartsSeed) {
            try {
              const newSparePart = this.sparePartRepository.create(sparePart);
              await this.sparePartRepository.save(newSparePart);
              successCount++;
            } catch (error) {
              this.logger.error(
                `Error al crear ${sparePart.name}: ${error.message}`,
              );
              errorCount++;
            }
          }
  
          this.logger.log(
            `✅ Semilla completada: ${successCount} repuestos creados, ${errorCount} errores`,
          );
        } else {
          this.logger.log(
            `✓ Ya existen ${count} repuestos en la base de datos`,
          );
        }
      } catch (error) {
        this.logger.error(
          'Error al verificar o ejecutar la semilla de repuestos:',
          error,
        );
      }
    }

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
  async decreaseStock(
    partId: string,
    quantity: number,
    manager?: EntityManager,
  ): Promise<void> {
    const repository = manager
      ? manager.getRepository(SparePart)
      : this.sparePartRepository;
    const part = await this.findOne(partId);
    if (part.stock < quantity) {
      throw new BadRequestException(
        `Low stock. Available: ${part.stock}, required: ${quantity}`,
      );
    }
    part.stock -= quantity;
    await repository.save(part);
  }

  async increaseStock(
    partId: string,
    quantity: number,
    manager?: EntityManager,
  ): Promise<void> {
    const repository = manager
      ? manager.getRepository(SparePart)
      : this.sparePartRepository;

    const part = await repository.findOne({ where: { id: partId } });

    if (!part) {
      throw new NotFoundException(`Spare part with ID ${partId} not found`);
    }

    part.stock += quantity;
    await repository.save(part);
  }
}
