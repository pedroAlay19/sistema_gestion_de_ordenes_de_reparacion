import { Module } from '@nestjs/common';
import { SparePartsService } from './spare-parts.service';
import { SparePartsController } from './spare-parts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SparePart } from './entities/spare-part.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SparePart])],
  controllers: [SparePartsController],
  providers: [SparePartsService],
  exports: [SparePartsService]
})
export class SparePartsModule {}
