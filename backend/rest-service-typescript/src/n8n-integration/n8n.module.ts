import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { N8nService } from './n8n.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
    }),
    ConfigModule,
  ],
  providers: [N8nService],
  exports: [N8nService],
})
export class N8nModule {}