import { Global, Module } from '@nestjs/common';
import { LocalTokenValidationService } from './services/local-token-validation.service';
import { AuthGuard } from './guard/auth.guard';
import { RolesGuard } from './guard/roles.guard';
import { CacheService } from './services/cache.service';

@Global()
@Module({
  imports: [],
  providers: [
    LocalTokenValidationService,
    AuthGuard,
    RolesGuard, // Necesario para @Auth decorator
    CacheService,
  ],
  exports: [
    LocalTokenValidationService,
    AuthGuard,
    RolesGuard, // Exportar para uso en controladores con @Auth
  ],
})
export class AuthModule {}