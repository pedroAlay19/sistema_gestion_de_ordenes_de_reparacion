import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { CreateMaintenanceServiceDto } from './dto/create-maintenance-service.dto';
import { UpdateMaintenanceServiceDto } from './dto/update-maintenance-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaintenanceService } from './entities/maintenance-service.entity';
import { maintenanceServicesSeed } from './seeds/maintenance-services.seed';
import { EquipmentsService } from 'src/equipments/equipments.service';

@Injectable()
export class MaintenanceServicesService implements OnModuleInit {
  private readonly logger = new Logger(MaintenanceServicesService.name);

  constructor(
    @InjectRepository(MaintenanceService)
    private readonly serviceRepository: Repository<MaintenanceService>,
    private readonly equipmentService: EquipmentsService,
  ) {}

  async onModuleInit() {
    await this.seedMaintenanceServices();
  }

  private async seedMaintenanceServices() {
    try {
      const count = await this.serviceRepository.count();

      if (count === 0) {
        this.logger.log(
          '🌱 No hay servicios de mantenimiento. Ejecutando semilla...',
        );

        let successCount = 0;
        let errorCount = 0;

        for (const service of maintenanceServicesSeed) {
          try {
            const newService = this.serviceRepository.create(service);
            await this.serviceRepository.save(newService);
            successCount++;
          } catch (error) {
            this.logger.error(
              `Error al crear ${service.serviceName}: ${error.message}`,
            );
            errorCount++;
          }
        }

        this.logger.log(
          `✅ Semilla completada: ${successCount} servicios creados, ${errorCount} errores`,
        );
      } else {
        this.logger.log(
          `✓ Ya existen ${count} servicios de mantenimiento en la base de datos`,
        );
      }
    } catch (error) {
      this.logger.error(
        'Error al verificar o ejecutar la semilla de servicios:',
        error,
      );
    }
  }

  async create(createServiceDto: CreateMaintenanceServiceDto) {
    const { serviceName } = createServiceDto;
    const existingService = await this.serviceRepository.findOneBy({
      serviceName,
    });
    if (existingService) {
      throw new BadRequestException(
        `Service with name ${serviceName} already exists`,
      );
    }
    const service = this.serviceRepository.create(createServiceDto);
    return await this.serviceRepository.save(service);
  }

  async findAll() {
    return await this.serviceRepository.find({ order: { createdAt: 'ASC' } });
  }

  async findApplicableServices(equipmentId: string) {
    const equipment = await this.equipmentService.findOneEquipment(equipmentId);
    return await this.serviceRepository
      .createQueryBuilder('service')
      .where(':type = ANY (service.applicableEquipmentTypes)', {
        type: equipment.type,
      })
      .andWhere('service.active = :isActive', { isActive: true })
      .orderBy('service.createdAt', 'ASC')
      .getMany();
  }

  async findOne(id: string) {
    const serviceFound = await this.serviceRepository.findOne({
      where: { id },
    });
    if (!serviceFound)
      throw new NotFoundException(`Service with id ${id} not found`);
    return serviceFound;
  }

  async update(id: string, updateServiceDto: UpdateMaintenanceServiceDto) {
    if (updateServiceDto.serviceName) {
      const existingService = await this.serviceRepository.findOneBy({
        serviceName: updateServiceDto.serviceName,
      });
      if (existingService && existingService.id !== id) {
        throw new BadRequestException(
          `Service with name ${updateServiceDto.serviceName} already exists`,
        );
      }
    }
    const result = await this.serviceRepository.update(id, updateServiceDto);
    if (result.affected === 0) {
      throw new NotFoundException(`Service with id ${id} not found`);
    }
    return this.findOne(id);
  }

  async remove(id: string) {
    const service = await this.serviceRepository.findOneBy({ id });
    if (!service)
      throw new NotFoundException(`Service with id ${id} not found`);
    await this.serviceRepository.remove(service);
  }
}
