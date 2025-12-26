import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateSparePartDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  stock: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  unitPrice: number;
}
