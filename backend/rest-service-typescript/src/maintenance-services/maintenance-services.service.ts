import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMaintenanceServiceDto } from './dto/create-maintenance-service.dto';
import { UpdateMaintenanceServiceDto } from './dto/update-maintenance-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaintenanceService } from './entities/maintenance-service.entity';

@Injectable()
export class MaintenanceServicesService {
  constructor(
    @InjectRepository(MaintenanceService)
    private readonly serviceRepository: Repository<MaintenanceService>,
  ) {}

  async create(createServiceDto: CreateMaintenanceServiceDto) {
    const service = this.serviceRepository.create(createServiceDto);
    return await this.serviceRepository.save(service);
  }

  async findAll() {
    return await this.serviceRepository.find({
      relations: ['repairOrderDetails'],
    });
  }

  async findOne(id: string) {
    const serviceFound = await this.serviceRepository.findOne({
      where: { id },
      relations: ['repairOrderDetails'],
    });
    if (!serviceFound)
      throw new NotFoundException(Service with id ${id} not found);
    return serviceFound;
  }

  async update(id: string, updateServiceDto: UpdateMaintenanceServiceDto) {
    const serviceFound = await this.serviceRepository.findOneBy({ id });
    if (!serviceFound)
      throw new NotFoundException(Service with id ${id} not found);
    await this.serviceRepository.update(id, updateServiceDto);
    return await this.serviceRepository.findOneBy({ id });
  }

  async remove(id: string) {
    const service = await this.serviceRepository.findOneBy({ id });
    if (!service)
      throw new NotFoundException(Service with id ${id} not found);
    await this.serviceRepository.remove(service);
  }
}