import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Equipment } from './entities/equipment.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class EquipmentsService {
  constructor(
    @InjectRepository(Equipment)
    private readonly equipmentRepository: Repository<Equipment>,

    private readonly userService: UsersService,
  ) {}

  async create(createEquipmentDto: CreateEquipmentDto) {
    const userFound = await this.userService.findOne(createEquipmentDto.userId);

    const equipment = this.equipmentRepository.create({
      ...createEquipmentDto,
      user: userFound,
    });
    return await this.equipmentRepository.save(equipment);
  }

  async findAll() {
    return await this.equipmentRepository.find({
      relations: ['user', 'repairOrders'],
    });
  }

  async findOne(id: string) {
    const equipmentFound = await this.equipmentRepository.findOne({
      where: { id },
      relations: ['user', 'repairOrders'],
    });
    if (!equipmentFound)
      throw new NotFoundException(Equipment with id ${id} not found);
    return equipmentFound;
  }

  async update(id: string, updateEquipmentDto: UpdateEquipmentDto) {
    const equipmentFound = await this.equipmentRepository.findOneBy({ id });
    if (!equipmentFound)
      throw new NotFoundException(Equipment with id ${id} not found);
    await this.equipmentRepository.update(id, updateEquipmentDto);
    return await this.equipmentRepository.findOneBy({ id });
  }

  async remove(id: string) {
    const equipment = await this.equipmentRepository.findOneBy({ id });
    if (!equipment)
      throw new NotFoundException(Equipment with id ${id} not found);
    await this.equipmentRepository.remove(equipment);
  }
}