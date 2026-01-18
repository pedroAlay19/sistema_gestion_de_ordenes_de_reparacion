import { IsString, IsNumber, IsOptional } from 'class-validator';

export class PromotionWebhookDto {
  @IsString()
  promotion_id: string;

  @IsString()
  repair_order_id: string;

  @IsString()
  promotion_type: string;

  @IsString()
  description: string;

  @IsNumber()
  @IsOptional()
  discount_percentage?: number;

  @IsString()
  @IsOptional()
  message?: string;
}
