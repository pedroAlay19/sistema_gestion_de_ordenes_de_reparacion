import {
  Controller,
  Post,
  Body,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
  Ip,
  Patch,
  Param,
} from '@nestjs/common';
import type{ Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthGuard } from './guards/auth.guard';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { Throttle } from '@nestjs/throttler';
import { LoginThrottleGuard } from './guards/login-throttle.guard';
import { UserRole } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);
    return {
      message: 'Usuario registrado exitosamente',
      user,
    };
  }

  // Momentaneo
  @Patch('change-role')
  @HttpCode(HttpStatus.OK)
  async changeUserRole(@Body() body: { userId: string; newRole: UserRole }) {
    await this.authService.changeUserRole(body.userId, body.newRole);
    return {
      message: 'User role updated successfully',
    };
  }

  @Post('register/technician')
  @HttpCode(HttpStatus.CREATED)
  async registerTechnician(@Body() registerDto: RegisterDto) {
    const user = await this.authService.registerTechnician(registerDto);
    return {
      message: 'Tecnico registrado exitosamente',
      user,
    };
  }

  @Patch('deactivate-user/:id')
  @HttpCode(HttpStatus.OK)
  async deactivateUser(@Param('id') id: string) {
    await this.authService.desactivateUser(id);
    return {
      message: 'User deactivated successfully',
    };
  }

  @Post('login')
  @Throttle({default: { limit: 5, ttl: 60000 }})
  @UseGuards(LoginThrottleGuard)
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
    @Ip() ip: string,
  ) {
    const userAgent = req.headers['user-agent'];
    const tokens = await this.authService.login(loginDto, userAgent, ip);

    return {
      message: 'Login exitoso',
      ...tokens,
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Req() req: Request,
    @Ip() ip: string,
  ) {
    const userAgent = req.headers['user-agent'];
    const result = await this.authService.refresh(
      refreshTokenDto.refreshToken,
      userAgent,
      ip,
    );

    return {
      message: 'Token renovado exitosamente',
      ...result,
    };
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request) {
    const user = req['user'] as JwtPayload;

    // user.exp es el momento exacto cuando expira el token, expresado como timestamp UNIX
    // timestamp UNIX está en segundos, por eso se multiplica por 1000 para obtener milisegundos
    const expiresAt = new Date(user.exp! * 1000);

    await this.authService.logout(user.sub, user.jti, expiresAt);

    return {
      message: 'Logout exitoso',
    };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async getProfile(@Req() req: Request) {
    const user = req['user'] as JwtPayload;
    const profile = await this.authService.getProfile(user.sub);

    return {
      user: profile,
    };
  }

  @Get('validate')
  async validateToken(@Req() req: Request) {
    const token = this.extractTokenFromHeader(req);

    if (!token) {
      return { valid: false };
    }

    try {
      const payload = await this.authService.validateToken(token);
      return {
        valid: true,
        payload,
      };
    } catch {
      return { valid: false };
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
