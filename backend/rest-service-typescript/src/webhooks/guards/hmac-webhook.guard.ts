import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { HmacService } from '../security/hmac.service';
import { PartnerService } from '../partner.service';

@Injectable()
export class HmacWebhookGuard implements CanActivate {
  constructor(
    private readonly hmacService: HmacService,
    private readonly partnerService: PartnerService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<any>();

    // Headers requeridos
    const signature = request.headers['x-webhook-signature'] as string;
    const partnerId = request.headers['x-partner-id'] as string;

    if (!signature) {
      throw new BadRequestException('Missing x-webhook-signature header');
    }

    if (!partnerId) {
      throw new BadRequestException('Missing x-partner-id header');
    }

    // Buscar partner
    const partner = await this.partnerService.findOne(partnerId);
    if (!partner || !partner.is_active) {
      throw new UnauthorizedException('Partner not found or inactive');
    }

    const secret = partner.secret;

    /**
     * 🔴 CLAVE:
     * Normalizamos el body EXACTAMENTE igual que Postman
     */
    const normalizedBody = JSON.stringify(request.body);
    const rawBody = Buffer.from(normalizedBody);

    try {
      // Validar firma SIN timestamp
      this.hmacService.verifyOrThrow(secret, '', rawBody, signature);

      // Adjuntar partner al request
      request.partner = partner;

      return true;
    } catch {
      throw new UnauthorizedException('Invalid webhook signature');
    }
  }
}
