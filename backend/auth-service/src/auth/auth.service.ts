import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './entities/user.entity';
import { TokenService } from './services/token.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { TokenPair } from './interfaces/jwt-payload.interface';
import { RestServiceSyncService } from './services/rest-service-sync.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private tokenService: TokenService,
    private restServiceSync: RestServiceSyncService,
  ) {}

  async register(registerDto: RegisterDto): Promise<Omit<User, 'password'>> {
    // Verificar si el email ya existe
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash del password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Crear usuario
    const user = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    this.restServiceSync.syncUserProfile(savedUser).catch((err) => {
      console.error('Sync user failed:', err);
    });
    return savedUser;
  }

  async registerTechnician(
    registerDto: RegisterDto,
  ): Promise<Omit<User, 'password'>> {
    // Verificar si el email ya existe
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash del password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Crear usuario
    const user = this.userRepository.create({
      ...registerDto,
      role: UserRole.TECHNICIAN,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    this.restServiceSync.syncTechnicianProfile(savedUser).catch((err) => {
      console.error('Sync technician failed:', err);
    });
    return savedUser;
  }

  async desactivateUser(userId: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new UnauthorizedException(`User with id ${userId} not found`);
    }

    user.isActive = false;
    await this.userRepository.save(user);
  }

  async login(
    loginDto: LoginDto,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<TokenPair> {
    // Buscar usuario por email
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verificar si el usuario está activo
    if (!user.isActive) {
      throw new UnauthorizedException('User is desactivated');
    }

    // Verificar password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Actualizar último login
    user.lastLoginAt = new Date();
    await this.userRepository.save(user);

    // Generar par de tokens
    return await this.tokenService.generateTokenPair(
      user,
      userAgent,
      ipAddress,
    );
  }

  async changeUserRole(userId: string, newRole: UserRole): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    user.role = newRole;
    await this.userRepository.save(user);
  }

  async refresh(
    refreshToken: string,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<{ accessToken: string }> {
    try {
      // Verificar refresh token
      const payload = await this.tokenService.verifyRefreshToken(refreshToken);

      // Verificar que sea un refresh token
      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Token inválido');
      }

      // Verificar que no esté revocado
      const isRevoked = await this.tokenService.isTokenRevoked(payload.jti);
      if (isRevoked) {
        throw new UnauthorizedException('Token revocado');
      }

      // Buscar usuario
      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('Usuario no válido');
      }

      // Generar nuevo access token
      const tokens = await this.tokenService.generateTokenPair(
        user,
        userAgent,
        ipAddress,
      );

      return { accessToken: tokens.accessToken };
    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }
  }

  async logout(userId: string, jti: string, expiresAt: Date): Promise<void> {
    // Revocar el access token actual
    await this.tokenService.revokeToken(jti, userId, expiresAt, 'logout');

    // Revocar todos los refresh tokens del usuario
    await this.tokenService.revokeAllUserTokens(userId);
  }

  async getProfile(userId: string): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    return user;
  }

  async validateToken(token: string) {
    try {
      const payload = await this.tokenService.verifyAccessToken(token);

      // Verificar que sea un access token
      if (payload.type !== 'access') {
        throw new UnauthorizedException('Token type inválido');
      }

      // Verificar blacklist
      const isRevoked = await this.tokenService.isTokenRevoked(payload.jti);
      if (isRevoked) {
        throw new UnauthorizedException('Token revocado');
      }

      return payload;
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }
}
