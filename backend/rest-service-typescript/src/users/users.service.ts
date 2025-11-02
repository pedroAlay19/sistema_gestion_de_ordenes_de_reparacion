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
import { UserRole } from './entities/enums/user-role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Technician)
    private readonly technicianRepository: Repository<Technician>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('A user already exists with this associated email address.');
    }
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async createTechnician(createTechnicianDto: CreateTechnicianDto) {
    const { email } = createTechnicianDto;
    const existingTechnician = await this.userRepository.findOne({ where: { email } });
    if (existingTechnician) {
      throw new BadRequestException('A user already exists with this associated email address.');
    }
    const technician = this.technicianRepository.create(createTechnicianDto);
    return await this.technicianRepository.save(technician);
  }

  async findUsers() {
    return await this.userRepository.find({
      where: { role: UserRole.USER },
      relations: ['equipments.repairOrders.repairOrderDetails'],
    });
  }

  async findTechnicians() {
    return await this.technicianRepository.find({
      relations: ['ticketServices.service'],
    });
  }

  async findOne(id: string) {
    const userFound = await this.userRepository.findOneBy({ id });
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

  async updateTechnician(id: string, updateTechnicianDto: UpdateUserDto) {
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
}
