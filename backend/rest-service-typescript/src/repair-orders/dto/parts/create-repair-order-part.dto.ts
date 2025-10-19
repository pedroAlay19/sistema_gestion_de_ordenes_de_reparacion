import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from "class-validator";

export class CreateRepairOrderPartDto {
  @IsUUID()
  @IsNotEmpty()
  repairOrderId: string;

  @IsUUID()
  partId: string;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  quantity: number;

  @IsString()
  @IsOptional()
  imgUrl?: string;
}
