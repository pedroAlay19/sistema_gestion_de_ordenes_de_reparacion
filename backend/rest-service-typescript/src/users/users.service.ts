import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Technician } from './entities/technician.entity';
import { UserRole } from './entities/enums/user-role.enum';
import { WebSocketNotificationService } from '../websocket/websocket-notification.service';
import { SyncUserDto } from './dto/sync-user.dto';
import { SyncTechnicianDto } from './dto/sync-technician.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Technician)
    private readonly technicianRepository: Repository<Technician>,

    private readonly wsNotificationService: WebSocketNotificationService,
  ) {}

  async findUsers() {
    return await this.userRepository.find({
      where: { role: UserRole.USER },
      relations: ['equipments.repairOrders'], // Para el graphql gateway
    });
  }

  async findTechnicians() {
    return await this.technicianRepository.find({
      relations: ['ticketServices.service'],
    });
  }

  async getUserByAuthUserId(authUserId: string) {
    // Primero intentar buscar en el repositorio de técnicos para obtener isEvaluator
    const technicianProfile = await this.technicianRepository.findOne({
      where: { userId: authUserId },
    });

    if (technicianProfile) {
      return technicianProfile;
    }

    // Si no es técnico, buscar en el repositorio de usuarios generales
    const profile = await this.userRepository.findOne({
      where: { userId: authUserId },
    });

    if (!profile) {
      throw new NotFoundException(
        `Profile not found for auth user ID: ${authUserId}`,
      );
    }

    return profile;
  }

  async findOne(id: string) {
    const userFound = await this.userRepository.findOne({
      where: { id },
    });
    if (!userFound) throw new NotFoundException(`User with id ${id} not found`);
    return userFound;
  }

  async findOneTechnician(id: string) {
    const userFound = await this.technicianRepository.findOneBy({ id });
    if (!userFound) throw new NotFoundException(`User with id ${id} not found`);
    return userFound;
  }

  async findTechnicianEvaluator() {
    const technician = await this.technicianRepository.findOneBy({
      isEvaluator: true,
    });
    if (!technician)
      throw new NotFoundException(`No evaluator technician found`);
    return technician;
  }

  async updateProfileByAuthUserId(
    authUserId: string,
    updateProfileDto: UpdateProfileDto,
  ) {
    const profile = await this.userRepository.findOne({
      where: { userId: authUserId },
    });

    if (!profile) {
      throw new NotFoundException(
        `Profile not found for auth user ID: ${authUserId}`,
      );
    }

    // Actualizar solo los campos proporcionados
    await this.userRepository.update(profile.id, updateProfileDto);

    return await this.userRepository.findOne({ where: { id: profile.id } });
  }

  async remove(id: string) {
    if (!(await this.userRepository.findOneBy({ id })))
      throw new NotFoundException(`User with id ${id} not found`);
    await this.userRepository.delete(id);
  }

  async usersOverview() {
    const totalClients = await this.userRepository.count({
      where: { role: UserRole.USER },
    });
    const totalTechnicians = await this.technicianRepository.count();
    const totalActiveTechnicians = await this.technicianRepository.count({
      where: { active: true },
    });
    return {
      totalClients,
      totalTechnicians,
      totalActiveTechnicians,
    };
  }

  async syncUser(syncUserDto: SyncUserDto) {
    // Verificar si ya existe
    const existing = await this.userRepository.findOne({
      where: { userId: syncUserDto.authUserId },
    });

    if (existing) {
      return existing;
    }

    // Crear perfil con userId y role (para TableInheritance)
    const userProfile = this.userRepository.create({
      userId: syncUserDto.authUserId,
      role: syncUserDto.role, // Necesario para TableInheritance
      name: syncUserDto.name,
      email: syncUserDto.email
    });

    const savedProfile = await this.userRepository.save(userProfile);

    return savedProfile;
  }

  async syncTechnician(syncTechnicianDto: SyncTechnicianDto) {
    const existing = await this.technicianRepository.findOne({
      where: { userId: syncTechnicianDto.authUserId },
    });

    if (existing) {
      return existing;
    }

    const technicianProfile = this.technicianRepository.create({
      userId: syncTechnicianDto.authUserId,
      role: syncTechnicianDto.role,
      name: syncTechnicianDto.name, 
      email: syncTechnicianDto.email, 
      specialty: syncTechnicianDto.specialty || 'Por definir',
    });

    const savedProfile = await this.technicianRepository.save(technicianProfile);

    return savedProfile;
  }
}
