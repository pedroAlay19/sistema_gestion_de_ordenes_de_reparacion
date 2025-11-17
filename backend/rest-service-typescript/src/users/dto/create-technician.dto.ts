import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class CreateTechnicianDto extends CreateUserDto {
  @IsString()
  @IsNotEmpty()
  specialty!: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  experienceYears!: number;

  @IsOptional()
  @IsBoolean()
  isEvaluator?: boolean;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
