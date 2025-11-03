import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/users/entities/enums/user-role.enum';
import { Request } from 'express'
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {

   constructor(private reflector: Reflector) {}
   
  canActivate(
    context: ExecutionContext,
  ): boolean {

    const role = this.reflector.getAllAndOverride<UserRole>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!role) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest<Request & { user: JwtPayload }>();

    return user.role === role;
  }
}
