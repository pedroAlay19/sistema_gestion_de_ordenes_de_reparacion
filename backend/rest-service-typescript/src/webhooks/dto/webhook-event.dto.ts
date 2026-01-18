import { IsString, IsObject, IsNotEmpty } from 'class-validator';

export class WebhookEventDto {
  @IsString()
  @IsNotEmpty()
  event: string;

  @IsObject()
  @IsNotEmpty()
  data: Record<string, any>;
}
