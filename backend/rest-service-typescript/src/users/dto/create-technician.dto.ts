import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class CreateTechnicianDto extends CreateUserDto {
  @IsString()
  @IsNotEmpty()
  specialty: string;

  @IsOptional()
  @IsBoolean()
  isEvaluator?: boolean;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
