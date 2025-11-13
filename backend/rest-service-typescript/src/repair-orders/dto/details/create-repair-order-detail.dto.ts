import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from "class-validator";

export class CreateRepairOrderDetailDto {
  @IsUUID() 
  @IsNotEmpty()
  serviceId: string;

  @IsUUID()
  @IsNotEmpty()
  technicianId: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  unitPrice?: number;

  @IsOptional()
  @IsNumber()
  discount?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
