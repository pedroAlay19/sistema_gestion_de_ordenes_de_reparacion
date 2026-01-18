import {
  Controller,
  Post,
  Body,
  UseGuards,
  Logger,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { HmacWebhookGuard } from './guards/hmac-webhook.guard';
import { WebhookEventDto } from './dto/webhook-event.dto';

@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('receive')
  @UseGuards(HmacWebhookGuard)
  @HttpCode(HttpStatus.OK)
  async receiveWebhook(@Body() payload: WebhookEventDto) {
    this.logger.log(`Webhook recibido: ${payload.event}`);

    const result = await this.webhooksService.processIncomingWebhook(payload);

    return {
      status: 'received',
      event: payload.event,
      ...result,
    };
  }
}
