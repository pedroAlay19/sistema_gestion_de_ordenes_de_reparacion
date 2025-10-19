import { PartialType } from "@nestjs/swagger";
import { CreateRepairOrderPartDto } from "./create-repair-order-part.dto";
import { IsNotEmpty, IsUUID } from "class-validator";

export class UpdateRepairOrderPartDto extends PartialType(CreateRepairOrderPartDto) {
    @IsNotEmpty()
    @IsUUID()
    id: string;
}