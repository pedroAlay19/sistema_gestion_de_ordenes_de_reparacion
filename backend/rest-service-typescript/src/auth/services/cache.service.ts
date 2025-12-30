import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class CacheService implements OnModuleInit {
  private readonly logger = new Logger(CacheService.name);
  private readonly PREFIX = 'revoked:';
  private redisClient: Redis;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    // Crear cliente Redis directo
    this.redisClient = new Redis({
      host: this.configService.get('REDIS_HOST') || 'localhost',
      port: this.configService.get('REDIS_PORT') || 6379,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    this.redisClient.on('connect', () => {
      this.logger.log('✅ Conectado a Redis');
    });

    this.redisClient.on('error', (error) => {
      this.logger.error(`❌ Error de Redis: ${error.message}`);
    });
  }

  private buildKey(jti: string): string {
    return `${this.PREFIX}${jti}`;
  }
  /**
   * Verifica si un token está en cache como revocado
   */
  async isTokenRevokedInCache(jti: string): Promise<boolean> {
    try {
      const key = this.buildKey(jti);
      const cached = await this.redisClient.get(key);
      const isRevoked = !!cached;

      this.logger.debug(
        `🔍 Token ${jti}: ${isRevoked ? '❌ REVOCADO' : '✅ NO revocado'}`,
      );

      return isRevoked;
    } catch (error) {
      this.logger.error(
        `Error al verificar token revocado: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error.stack : undefined,
      );
      return false;
    }
  }
}
