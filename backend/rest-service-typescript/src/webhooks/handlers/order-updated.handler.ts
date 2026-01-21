import { Injectable, Logger } from '@nestjs/common';
import { WebhookEventHandler } from './webhook-event.handler';

@Injectable()
export class OrderUpdatedHandler implements WebhookEventHandler {
  private readonly logger = new Logger(OrderUpdatedHandler.name);

  supports(event: string): boolean {
    return event === 'order.updated';
  }

  async handle(data: any): Promise<any> {
    this.logger.log(`Orden actualizada: ${data.order_id}`);

    return {
      status: 'processed',
      message: 'Order updated',
    };
  }
}
