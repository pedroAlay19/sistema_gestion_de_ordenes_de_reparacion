import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMaintenanceServiceDto } from './dto/create-maintenance-service.dto';
import { UpdateMaintenanceServiceDto } from './dto/update-maintenance-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaintenanceService } from './entities/maintenance-service.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MaintenanceServicesService {
  constructor(
    @InjectRepository(MaintenanceService)
    private readonly serviceRepository: Repository<MaintenanceService>,

    private readonly http: HttpService,
  ) {}

  async create(createServiceDto: CreateMaintenanceServiceDto) {
    const { serviceName } = createServiceDto;
    const existingService = await this.serviceRepository.findOneBy({
      serviceName,
    });
    if (existingService) {
      throw new NotFoundException(
        `Service with name ${serviceName} already exists`,
      );
    }
    const service = this.serviceRepository.create(createServiceDto);
    const resul = await this.serviceRepository.save(service);

    try {
      await firstValueFrom(
        this.http.post('http://localhost:8081/notify', {
          type: 'mantenance_service_created',
          action: 'create',
          id: resul.id,
        }),
      );
      console.log('Notification sent successfully');
    } catch (error) {
      console.error('Error sending notification:', error);
    }
    return resul;
  }

  async findAll() {
    return await this.serviceRepository.find(
      { order: { serviceName: 'ASC' } },
    );
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
        throw new NotFoundException(
          `Service with name ${updateServiceDto.serviceName} already exists`,
        );
      }
    }
    const serviceFound = await this.serviceRepository.findOneBy({ id });
    if (!serviceFound)
      throw new NotFoundException(`Service with id ${id} not found`);
    await this.serviceRepository.update(id, updateServiceDto);
    return await this.serviceRepository.findOneBy({ id });
  }

  async remove(id: string) {
    const service = await this.serviceRepository.findOneBy({ id });
    if (!service)
      throw new NotFoundException(`Service with id ${id} not found`);
    await this.serviceRepository.remove(service);
  }
}
