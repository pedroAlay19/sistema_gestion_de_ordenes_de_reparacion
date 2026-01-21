import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { PromotionWebhookDto } from '../dto/promotion-webhook.dto';
import { WebhookEventHandler } from './webhook-event.handler';

@Injectable()
export class PromotionCreatedHandler
  implements WebhookEventHandler<PromotionWebhookDto>
{
  private readonly logger = new Logger(PromotionCreatedHandler.name);

  supports(event: string): boolean {
    return event === 'promotion.created';
  }

  async handle(data: PromotionWebhookDto): Promise<any> {
    const dto = plainToInstance(PromotionWebhookDto, data);
    const errors = await validate(dto);

    if (errors.length > 0) {
      throw new BadRequestException('Invalid promotion data');
    }

    this.logger.log(
      `Promoción para orden ${dto.repair_order_id}: ${dto.description}`,
    );

    return {
      status: 'processed',
      promotion_id: dto.promotion_id,
    };
  }
}
