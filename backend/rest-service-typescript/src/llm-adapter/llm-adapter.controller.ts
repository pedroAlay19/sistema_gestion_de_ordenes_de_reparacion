import { 
  Controller, 
  Post, 
  Body, 
  Get,
} from '@nestjs/common';
import { LLMAdapterService } from './llm-adapter.service';
import { ChatRequestDto } from './dto/chat-request.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { UserRole } from '../users/entities/enums/user-role.enum';

@Controller('api/llm')
export class LLMAdapterController {
  constructor(private readonly llmService: LLMAdapterService) {}

  @Post('chat')
  @Auth(UserRole.USER)
  async chat(@Body() request: ChatRequestDto) {
    return this.llmService.chat(request);
  }

  @Get('tools')
  @Auth(UserRole.USER, UserRole.TECHNICIAN, UserRole.ADMIN)
  async listTools() {
    return this.llmService.getAvailableTools();
  }
}