import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserRole } from 'src/users/entities/enums/user-role.enum';
import { Auth } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: CreateUserDto) {
    return this.authService.register(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
  
  @Get('profile')
  @Auth(UserRole.TECHNICIAN)
  getProfile(@Request() req: { user: JwtPayload}) {
    return req.user;
  }
}
