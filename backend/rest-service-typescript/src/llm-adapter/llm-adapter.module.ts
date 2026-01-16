import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LLMAdapterController } from './llm-adapter.controller';
import { LLMAdapterService } from './llm-adapter.service';
import { MCPClient } from './clients/mcp-client';
import { GeminiProvider } from './providers/gemini.provider';

@Module({
  imports: [HttpModule],
  controllers: [LLMAdapterController],
  providers: [
    LLMAdapterService,
    MCPClient,
    GeminiProvider,
  ],
  exports: [LLMAdapterService],
})
export class LLMAdapterModule {}
