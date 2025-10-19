import { IsBoolean, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTechnicianDto extends CreateUserDto {
  @ApiProperty({
    example: 'Laptop and hardware repair',
    description: 'Technician specialization area.',
  })
  @IsString()
  @IsNotEmpty()
  specialty!: string;

  @ApiProperty({
    example: 5,
    description: 'Years of technical experience.',
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  experienceYears!: number;

  @ApiProperty({
    example: true,
    description: 'Indicates whether the technician is currently active.',
  })
  @IsBoolean()
  active: boolean;
}
