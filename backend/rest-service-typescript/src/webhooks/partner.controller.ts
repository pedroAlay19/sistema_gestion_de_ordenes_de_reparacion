import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PartnerService } from './partner.service';
import { PartnerRegisterDto } from './dto/partner-register.dto';
import { Partner } from './entities/partner.entity';

@Controller('partners')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() partnerData: PartnerRegisterDto): Promise<Partner> {
    return await this.partnerService.register(partnerData);
  }

  @Get()
  async findAll(): Promise<Partner[]> {
    return await this.partnerService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Partner> {
    return await this.partnerService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deactivate(@Param('id') id: string): Promise<void> {
    await this.partnerService.deactivate(id);
  }
}
