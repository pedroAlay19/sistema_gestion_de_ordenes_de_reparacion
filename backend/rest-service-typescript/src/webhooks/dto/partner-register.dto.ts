import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';

export class PartnerRegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  webhook_url: string;

  @IsArray()
  @IsOptional()
  subscribed_events?: string[];
}
