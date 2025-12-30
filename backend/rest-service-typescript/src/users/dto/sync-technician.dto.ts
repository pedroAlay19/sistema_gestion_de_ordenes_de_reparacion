import { IsOptional, IsString } from 'class-validator';
import { SyncUserDto } from './sync-user.dto';

export class SyncTechnicianDto extends SyncUserDto {
  @IsString()
  @IsOptional()
  specialty?: string;
}
