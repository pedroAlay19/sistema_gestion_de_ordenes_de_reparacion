import { PartialType } from '@nestjs/swagger';
import { CreateRepairOrderReviewDto } from './create-repair-order-review.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateRepairOrderReviewDto extends PartialType(CreateRepairOrderReviewDto) {
  @IsOptional()
  @IsBoolean()
  visible?: boolean;
}
