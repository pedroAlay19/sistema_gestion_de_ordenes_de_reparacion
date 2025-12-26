import { PartialType } from '@nestjs/mapped-types';
import { CreateRepairOrderPartDto } from './create-repair-order-part.dto';

export class UpdateRepairOrderPartDto extends PartialType(CreateRepairOrderPartDto) {}