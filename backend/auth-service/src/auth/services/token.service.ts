import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';
import { RefreshToken } from '../entities/refresh-token.entity';
import { RevokedToken } from '../entities/revoked-token.entity';
import { User } from '../entities/user.entity';
import { JwtPayload, TokenPair } from '../interfaces/jwt-payload.interface';
import { CacheService } from './cache.service';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private cacheService: CacheService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    @InjectRepository(RevokedToken)
    private revokedTokenRepository: Repository<RevokedToken>,
  ) {}


  async generateTokenPair(
    user: User,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<TokenPair> {
    const accessJti = uuidv4();
    const refreshJti = uuidv4();

    // Access Token - Corta duración, incluye permisos
    const accessPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      jti: accessJti,
      type: 'access',
    };

    const accessToken = this.jwtService.sign(accessPayload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION'),
    });

    // Refresh Token - Larga duración, mínima información
    const refreshPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      jti: refreshJti,
      type: 'refresh',
    };

    const refreshToken = this.jwtService.sign(refreshPayload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION'),
    });

    // Guardar refresh token en BD (hasheado)
    await this.saveRefreshToken(
      refreshToken,
      user,
      userAgent,
      ipAddress,
    );

    return { accessToken, refreshToken };
  }


  private async saveRefreshToken(
    token: string,
    user: User,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<void> {
    const tokenHash = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const expiresAt = new Date();
    expiresAt.setDate(
      expiresAt.getDate() +
        parseInt(this.configService.get('JWT_REFRESH_EXPIRATION')!),
    );

    const refreshToken = this.refreshTokenRepository.create({
      token: tokenHash,
      user,
      userId: user.id,
      expiresAt,
      userAgent,
      ipAddress,
    });

    await this.refreshTokenRepository.save(refreshToken);
  }

async isTokenRevoked(jti: string): Promise<boolean> {
  const cachedResult = await this.cacheService.isTokenRevokedInCache(jti);
  if (cachedResult) {
    return true;
  }
    const revokedToken = await this.revokedTokenRepository.findOne({
      where: { jti },
    });

    if (revokedToken) {
    const ttl = Math.floor((revokedToken.expiresAt.getTime() - Date.now()) / 1000);
    await this.cacheService.cacheTokenRevocation(jti, ttl);
    return true;
  }

    return false;
  }

  async revokeToken(
    jti: string,
    userId: string,
    expiresAt: Date,
    reason: string = 'logout',
  ): Promise<void> {
    const revokedToken = this.revokedTokenRepository.create({
      jti,
      userId,
      expiresAt,
      reason,
    });

    await this.revokedTokenRepository.save(revokedToken);
    console.log('✅ Token guardado en BD');
    
    const ttl = Math.floor((expiresAt.getTime() - Date.now()) / 1000);
    
    if (ttl > 0) {
      await this.cacheService.cacheTokenRevocation(jti, ttl);
      console.log('✅ revokeToken completado');
    } else {
      console.log('⚠️  [TOKEN-SERVICE] TTL <= 0, NO se cachea en Redis');
    }
  }

  async verifyAccessToken(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync<JwtPayload>(token, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
    });
  }

  async verifyRefreshToken(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync<JwtPayload>(token, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.refreshTokenRepository.update(
      { userId, isRevoked: false },
      { isRevoked: true },
    );
  }


  async cleanExpiredTokens(): Promise<void> {
    const now = new Date();
    
    // Eliminar refresh tokens expirados
    await this.refreshTokenRepository.delete({
      expiresAt: LessThan(now),
    });

    // Eliminar tokens revocados expirados
    await this.revokedTokenRepository.delete({
      expiresAt: LessThan(now),
    });
  }
}