import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Technician } from './entities/technician.entity';
import { CreateTechnicianDto } from './dto/create-technician.dto';
import { UpdateTechnicianDto } from './dto/update-technician.dto';
import { UserRole } from './entities/enums/user-role.enum';
import * as bcrypt from 'bcrypt';
import { OrderRepairStatus, TicketServiceStatus } from '../repair-orders/entities/enum/order-repair.enum';
import { WebSocketNotificationService } from '../websocket/websocket-notification.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Technician)
    private readonly technicianRepository: Repository<Technician>,

    private readonly wsNotificationService: WebSocketNotificationService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException(
        'A user already exists with this associated email address.',
      );
    }
    const user = this.userRepository.create({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    });
    const savedUser = await this.userRepository.save(user);
    
    await this.wsNotificationService.notifyDashboardUpdate('USER_CREATED', savedUser.id);
    
    return savedUser;
  }

  async createTechnician(createTechnicianDto: CreateTechnicianDto) {
    const { email } = createTechnicianDto;
    const existingTechnician = await this.userRepository.findOne({
      where: { email },
    });
    if (existingTechnician) {
      throw new BadRequestException(
        'A user already exists with this associated email address.',
      );
    }
    const technician = this.technicianRepository.create({
      ...createTechnicianDto,
      password: await bcrypt.hash(createTechnicianDto.password, 10),
    });
    const savedTechnician = await this.technicianRepository.save(technician);
    
    await this.wsNotificationService.notifyDashboardUpdate('TECHNICIAN_CREATED', savedTechnician.id);
    
    return savedTechnician;
  }

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

  async findOne(id: string) {
    const userFound = await this.userRepository.findOne({
      where: { id },
      relations: ['equipments.repairOrders'], // Para el graphql gateway
    });
    if (!userFound) throw new NotFoundException(`User with id ${id} not found`);
    return userFound;
  }

  async findOneTechnician(id: string) {
    const userFound = await this.technicianRepository.findOneBy({ id });
    if (!userFound) throw new NotFoundException(`User with id ${id} not found`);
    return userFound;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user)
      throw new UnauthorizedException(`User with email ${email} not found`);
    return user;
  }

  async findByEmailWithPassword(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'role'],
    });
    if (!user)
      throw new UnauthorizedException(`User with email ${email} not found`);
    return user;
  }

  async findTechnicianEvaluator() {
    const technician = await this.technicianRepository.findOneBy({ isEvaluator: true });
    if (!technician)
      throw new NotFoundException(`No evaluator technician found`);
    return technician;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const userFound = await this.userRepository.findOneBy({ id });
    if (!userFound) throw new NotFoundException(`User with id ${id} not found`);
    if (userFound.role !== UserRole.USER)
      throw new BadRequestException(
        `Cannot update a technician with this endpoint`,
      );
    await this.userRepository.update(id, updateUserDto);
    return await this.userRepository.findOneBy({ id });
  }

  async updateTechnician(id: string, updateTechnicianDto: UpdateTechnicianDto) {
    const technicianFound = await this.technicianRepository.findOneBy({ id });
    if (!technicianFound)
      throw new NotFoundException(`Technician with id ${id} not found`);
    
    await this.technicianRepository.update(id, updateTechnicianDto);
    return await this.technicianRepository.findOneBy({ id });
  }

  async remove(id: string) {
    if (!(await this.userRepository.findOneBy({ id })))
      throw new NotFoundException(`User with id ${id} not found`);
    await this.userRepository.delete(id);
  }


  async getUsersOverview() {
    const [totalClients, totalTechnicians, activeTechnicians] = await Promise.all([
      this.userRepository.count({ where: { role: UserRole.USER } }),
      this.technicianRepository.count(),
      this.technicianRepository.count({ where: { active: true } }),
    ]);

    return {
      totalClients,
      totalTechnicians,
      activeTechnicians,
    };
  }

  async getTopClients(limit: number = 5) {
    const users = await this.userRepository.find({
      where: { role: UserRole.USER },
      relations: ['equipments', 'equipments.repairOrders'],
      select: {
        id: true,
        name: true,
        email: true,
        equipments: {
          repairOrders: {
            status: true,
            finalCost: true,
          },
        },
      },
    });

    const clientStats = users.map((user) => {
      const orders = user.equipments?.flatMap((e) => e.repairOrders || []) || [];
      const totalSpent = orders
        .filter((o) => o.status === OrderRepairStatus.DELIVERED)
        .reduce((sum, o) => sum + Number(o.finalCost || 0), 0);
      const totalOrders = orders.length;

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        totalOrders,
        totalSpent: Math.round(totalSpent * 100) / 100,
      };
    });

    const topClients = clientStats
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, limit);

    return { topClients };
  }


  async getTopTechnicians(limit: number = 5) {
    const technicians = await this.technicianRepository.find({
      relations: ['ticketServices'],
      select: {
        id: true,
        name: true,
        specialty: true,
        active: true,
        ticketServices: {
          status: true,
          subTotal: true,
        },
      },
    });

    const technicianStats = technicians.map((tech) => {
      const orders = tech.ticketServices || [];
      const completedOrders = orders.filter(
        (ts) => ts.status === TicketServiceStatus.COMPLETED,
      ).length;
      const revenue = orders
        .filter((ts) => ts.status === TicketServiceStatus.COMPLETED)
        .reduce((sum, ts) => sum + Number(ts.subTotal || 0), 0);

      return {
        id: tech.id,
        name: tech.name,
        specialty: tech.specialty,
        completedOrders,
        revenue: Math.round(revenue * 100) / 100,
        active: tech.active,
      };
    });

    const topTechnicians = technicianStats
      .sort((a, b) => b.completedOrders - a.completedOrders)
      .slice(0, limit);

    return { topTechnicians };
  }

  async getTotalClientsCount() {
    const count = await this.userRepository.count({ 
      where: { role: UserRole.USER } 
    });
    return { count };
  }

  async getTotalTechniciansCount() {
    const count = await this.technicianRepository.count();
    return { count };
  }

  async getActiveTechniciansCount() {
    const count = await this.technicianRepository.count({ 
      where: { active: true } 
    });
    return { count };
  }
}
