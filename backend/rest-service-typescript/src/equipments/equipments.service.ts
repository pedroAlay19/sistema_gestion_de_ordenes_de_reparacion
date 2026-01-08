import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Equipment } from './entities/equipment.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { UserRole } from 'src/users/entities/enums/user-role.enum';
import { EquipmentStatus } from './entities/enums/equipment.enum';

@Injectable()
export class EquipmentsService {
  constructor(
    @InjectRepository(Equipment)
    private readonly equipmentRepository: Repository<Equipment>,

    private readonly userService: UsersService,
  ) {}

  async create(createEquipmentDto: CreateEquipmentDto, user: JwtPayload) {
    const userFound = await this.userService.getUserByAuthUserId(user.sub);

    const equipment = this.equipmentRepository.create({
      ...createEquipmentDto,
      user: userFound,
    });
    return await this.equipmentRepository.save(equipment);
  }

  async findAll(user: JwtPayload) {
    if (user.role === UserRole.ADMIN) {
      return await this.equipmentRepository.find({
        relations: ['user', 'repairOrders'],
        order: { createdAt: 'DESC' },
      });
    }
    return await this.equipmentRepository.find({
      relations: ['repairOrders'],
      where: { user: { userId: user.sub } },
      order: { createdAt: 'DESC' },
    });
  }

  async findOneById(id: string) {
    const equipment = await this.equipmentRepository.findOne({
      where: { id },
      relations: ['user', 'repairOrders'],
    });
    if (!equipment)
      throw new NotFoundException(`Equipment with id ${id} not found`);
    return equipment;
  }

  async findOneAvailable(id: string) {
    const equipment = await this.equipmentRepository.findOne({
      where: { id, currentStatus: EquipmentStatus.AVAILABLE },
      relations: ['user', 'repairOrders'],
    });
    if (!equipment)
      throw new NotFoundException(
        `Equipment with id ${id} not found or not available`,
      );
    return equipment;
  }

  async findOne(id: string, user: JwtPayload) {
    const whereCondition =
      user.role === UserRole.ADMIN || UserRole.TECHNICIAN ? { id } : { id, user: { userId: user.sub } };

    const equipment = await this.equipmentRepository.findOne({
      where: whereCondition,
      relations: ['user', 'repairOrders'],
    });
    if (!equipment)
      throw new NotFoundException(`Equipment with id ${id} not found`);
    return equipment;
  }

  async search(query: string, user: JwtPayload): Promise<Equipment[]> {
    console.log(`Searching for equipment with query: "${query}" for user: ${user.sub}`);
    // Búsqueda case-insensitive por nombre, marca o modelo
    // Filtrando por el userId que coincida con user.sub (ID del auth-service)
    const equipments = await this.equipmentRepository
      .createQueryBuilder('equipment')
      .leftJoinAndSelect('equipment.user', 'user')
      .where('user.userId = :userId', { userId: user.sub })
      .andWhere('(LOWER(equipment.name) LIKE LOWER(:query) OR LOWER(equipment.brand) LIKE LOWER(:query) OR LOWER(equipment.model) LIKE LOWER(:query))', { query: `%${query}%` })
      .orderBy('equipment.createdAt', 'DESC')
      .getMany();
    
    console.log(`Found ${equipments.length} equipment(s) matching "${query}" for user ${user.sub}`);
    return equipments;
  }

  async findOneEquipment(id: string) {
    const equipment = await this.equipmentRepository.findOneBy({ id });
    if (!equipment)
      throw new NotFoundException(`Equipment with id ${id} not found`);
    return equipment;
  }

  async update(
    id: string,
    updateEquipmentDto: UpdateEquipmentDto,
    user: JwtPayload,
  ) {
    const equipmentFound = await this.findOne(id, user);
    Object.assign(equipmentFound, updateEquipmentDto);
    return await this.equipmentRepository.save(equipmentFound);
  }

  async remove(id: string, user: JwtPayload) {
    const equipment = await this.findOne(id, user);
    return await this.equipmentRepository.remove(equipment);
  }

  async updateStatus(id: string, status: EquipmentStatus) {
    const equipment = await this.findOneById(id);
    equipment.currentStatus = status;
    return await this.equipmentRepository.save(equipment);
  }
}
