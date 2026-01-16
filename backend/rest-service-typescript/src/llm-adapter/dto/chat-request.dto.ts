import { IsString, IsEnum, IsOptional, IsArray, ValidateNested, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';

class MessageContentDto {
  @IsEnum(['text', 'image'])
  type: 'text' | 'image';

  @ValidateIf(o => o.type === 'text')
  @IsString()
  text?: string;

  @ValidateIf(o => o.type === 'image')
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ValidateIf(o => o.type === 'image')
  @IsString()
  @IsOptional()
  imageBase64?: string;

  @ValidateIf(o => o.type === 'image')
  @IsString()
  @IsOptional()
  mimeType?: string;
}

class MessageDto {
  @IsEnum(['user', 'assistant', 'system'])
  role: 'user' | 'assistant' | 'system';

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MessageContentDto)
  content: MessageContentDto[];
}

export class ChatRequestDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MessageDto)
  messages: MessageDto[];

  @IsEnum(['gemini', 'openai'])
  @IsOptional()
  provider?: 'gemini' | 'openai';
}