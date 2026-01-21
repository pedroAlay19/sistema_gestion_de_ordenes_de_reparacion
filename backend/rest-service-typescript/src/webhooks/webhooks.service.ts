import { Injectable, Logger, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { HmacService } from './security/hmac.service';
import { PartnerService } from './partner.service';
import { WebhookEventDto } from './dto/webhook-event.dto';
import { WebhookEventHandler } from './handlers/webhook-event.handler';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly hmacService: HmacService,
    private readonly partnerService: PartnerService,

    @Inject('WEBHOOK_HANDLERS')
    private readonly handlers: WebhookEventHandler[],
  ) {}

  /**
   * Envía un webhook al partner (cine) cuando se crea una orden de reparación
   */
  async sendOrderCreatedWebhook(
    partnerUrl: string,
    secret: string,
    orderData: any,
  ): Promise<void> {
    const payload: WebhookEventDto = {
      event: 'order.created',
      data: orderData,
    };

    await this.sendWebhookToPartner(partnerUrl, secret, payload);
  }

  /**
   * Envía webhook a todos los partners suscritos a un evento
   */
  async notifyPartnersOfEvent(
    eventType: string,
    eventData: any,
  ): Promise<void> {
    const partners = await this.partnerService.findByEvent(eventType);

    this.logger.log(
      `Notificando evento "${eventType}" a ${partners.length} partners`,
    );

    const payload: WebhookEventDto = {
      event: eventType,
      data: eventData,
    };

    for (const partner of partners) {
      try {
        await this.sendWebhookToPartner(
          partner.webhook_url,
          partner.secret,
          payload,
        );
      } catch (error) {
        this.logger.error(
          `Error al notificar a ${partner.name}: ${error.message}`,
        );
      }
    }
  }

  /**
   * Método  para enviar webhooks a partners
   */
  async sendWebhookToPartner(
    url: string,
    secret: string,
    payload: WebhookEventDto,
  ): Promise<void> {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    //const payloadJson = JSON.stringify(payload);
    const rawBody = Buffer.from(JSON.stringify(payload), 'utf8');

    // Generar firma HMAC
    const signature = this.hmacService.sign(secret, timestamp, rawBody);

    try {
      const response = await firstValueFrom(
        this.httpService.post(url, payload, {
          headers: {
            'Content-Type': 'application/json',
            'x-webhook-signature': signature,
            'x-webhook-timestamp': timestamp,
          },
        }),
      );

      this.logger.log(
        `Webhook enviado exitosamente a ${url} - Status: ${response.status}`,
      );
    } catch (error) {
      this.logger.error(
        `Error al enviar webhook a ${url}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Procesa eventos recibidos del partner (cine)
   */
  async processIncomingWebhook(payload: WebhookEventDto): Promise<any> {
    const { event, data } = payload;

    

    const handler = this.handlers.find(h => h.supports(event));

    if (!handler) {
      this.logger.warn(`Evento no manejado: ${event}`);
      return {
        status: 'received',
        message:'Tipo de evento no manejado',
      };
    }
    return handler.handle(data);
  }

  /**
   * Maneja el evento de promoción creada por el cine
   
  private async handlePromotionCreated(
    data: PromotionWebhookDto,
  ): Promise<any> {
    this.logger.log(
      `Promoción recibida para orden: ${data.repair_order_id} - ${data.description}`,
    );

    // Aquí puedes:
    // 1. Guardar la promoción en tu BD
    // 2. Notificar al usuario vía WebSocket
    // 3. Actualizar el estado de la orden

    // Por ahora solo logueamos
    return {
      status: 'processed',
      promotion_id: data.promotion_id,
      message: 'Promotion received and will be notified to user',
    };
  }*/

  /**
   * Maneja actualizaciones de órdenes
   
  private async handleOrderUpdated(data: any): Promise<any> {
    this.logger.log(`Orden actualizada: ${data.order_id}`);

    return {
      status: 'processed',
      message: 'Order update received',
    };
  }
    */
}
