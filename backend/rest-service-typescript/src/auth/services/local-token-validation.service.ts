import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { CacheService } from './cache.service';

@Injectable()
export class LocalTokenValidationService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private cacheService: CacheService,
  ) {}

  async validateTokenLocally(token: string): Promise<JwtPayload> {
    const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
    });

    if (payload.type !== 'access') {
      throw new UnauthorizedException('Invalid token type');
    }

    // PASO 3: Verificar blacklist en Redis (cache compartido)
    const isRevoked = await this.isTokenRevokedInCache(payload.jti);
    if (isRevoked) {
      throw new UnauthorizedException('Token has been revoked');
    }

    return payload;
  }

  private async isTokenRevokedInCache(jti: string): Promise<boolean> {
    const cached = await this.cacheService.isTokenRevokedInCache(jti);
    return !!cached;
  }
}