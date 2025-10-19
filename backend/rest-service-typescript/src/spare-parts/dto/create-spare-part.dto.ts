import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateSparePartDto {
  @ApiProperty({
    example: 'SSD 500GB Kingston',
    description: 'Name of the spare part used in technical repairs.',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Solid State Drive compatible with laptops and desktops.',
    description: 'Detailed description of the spare part.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 25,
    description: 'Current stock available in the inventory.',
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  stock: number;

  @ApiProperty({
    example: 65.99,
    description: 'Unit price of the spare part in USD.',
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  unitPrice: number;
}
