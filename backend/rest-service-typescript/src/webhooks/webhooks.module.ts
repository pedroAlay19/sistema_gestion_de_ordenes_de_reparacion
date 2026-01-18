import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';
import { HmacService } from './security/hmac.service';
import { HmacWebhookGuard } from './guards/hmac-webhook.guard';
import { PartnerController } from './partner.controller';
import { PartnerService } from './partner.service';
import { Partner } from './entities/partner.entity';

@Module({
  imports: [
    ConfigModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    TypeOrmModule.forFeature([Partner]),
  ],
  controllers: [WebhooksController, PartnerController],
  providers: [WebhooksService, HmacService, HmacWebhookGuard, PartnerService],
  exports: [WebhooksService, PartnerService],
})
export class WebhooksModule {}