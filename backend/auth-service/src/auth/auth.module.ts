import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenService } from './services/token.service';
import { CacheService } from './services/cache.service';
import { User } from './entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { RevokedToken } from './entities/revoked-token.entity';
import { TokenCleanupTask } from './tasks/token-cleanup.task';
import { RestServiceSyncService } from './services/rest-service-sync.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RefreshToken, RevokedToken]),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    CacheService,
    TokenCleanupTask,
    RestServiceSyncService,
  ],
  exports: [],
})
export class AuthModule {}
