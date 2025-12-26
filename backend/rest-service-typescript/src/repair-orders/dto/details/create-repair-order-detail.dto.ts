import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateRepairOrderDetailDto {
  @IsUUID() 
  @IsNotEmpty()
  serviceId: string;

  @IsUUID()
  @IsNotEmpty()
  technicianId: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
