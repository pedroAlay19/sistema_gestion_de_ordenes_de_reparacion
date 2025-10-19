import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from "class-validator";

export class CreateRepairOrderDetailDto {

  @IsUUID()
  @IsNotEmpty()
  repairOrderId: string;

  @IsUUID() 
  @IsNotEmpty()
  serviceId: string;

  @IsUUID()
  @IsNotEmpty()
  technicianId: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  unitPrice: number;

  @IsOptional()
  @IsNumber()
  discount: number;

  @IsNotEmpty()
  @IsString()
  notes: string;
}
