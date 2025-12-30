import { Module } from '@nestjs/common';
import { SparePartsService } from './spare-parts.service';
import { SparePartsController } from './spare-parts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SparePart } from './entities/spare-part.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([SparePart]), AuthModule],
  controllers: [SparePartsController],
  providers: [SparePartsService],
  exports: [SparePartsService]
})
export class SparePartsModule {}
