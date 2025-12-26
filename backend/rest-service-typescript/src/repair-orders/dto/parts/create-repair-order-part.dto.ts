import { IsInt, IsNotEmpty, IsUUID, Min } from "class-validator";

export class CreateRepairOrderPartDto {
  @IsUUID()
  @IsNotEmpty()
  partId: string;
  
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  quantity: number;
}
