import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { HmacService } from '../security/hmac.service';
import { PartnerService } from '../partner.service';

interface RequestWithRawBody extends Request {
  rawBody?: Buffer;
}

@Injectable()
export class HmacWebhookGuard implements CanActivate {
  constructor(
    private readonly hmacService: HmacService,
    private readonly partnerService: PartnerService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithRawBody>();

    // Obtener headers necesarios
    const signature = request.headers['x-webhook-signature'] as string;
    const timestamp = request.headers['x-webhook-timestamp'] as string;
    const partnerId = request.headers['x-partner-id'] as string;

    if (!signature) {
      throw new BadRequestException('Missing x-webhook-signature header');
    }

    // Comentado temporalmente - validación de timestamp
    // if (!timestamp) {
    //   throw new BadRequestException('Missing x-webhook-timestamp header');
    // }

    if (!partnerId) {
      throw new BadRequestException('Missing x-partner-id header');
    }

    // Buscar el partner en la base de datos
    let partner;
    try {
      partner = await this.partnerService.findOne(partnerId);
    } catch (error) {
      throw new UnauthorizedException('Partner not found or inactive');
    }

    if (!partner || !partner.is_active) {
      throw new UnauthorizedException('Partner not found or inactive');
    }

    const secret = partner.secret;

    // Comentado temporalmente - validación de timestamp
    // // Verificar que el timestamp no sea muy antiguo (5 minutos)
    // const now = Math.floor(Date.now() / 1000);
    // const requestTime = parseInt(timestamp, 10);

    // if (isNaN(requestTime)) {
    //   throw new BadRequestException('Invalid timestamp format');
    // }

    // if (Math.abs(now - requestTime) > 300) {
    //   throw new UnauthorizedException(
    //     'Request timestamp too old or too far in the future',
    //   );
    // }

    // Obtener el raw body
    const rawBody = request.rawBody || Buffer.from(JSON.stringify(request.body));

    try {
      // Verificar la firma HMAC (sin timestamp por ahora)
      this.hmacService.verifyOrThrow(secret, timestamp || '', rawBody, signature);
      
      // Agregar info del partner al request para uso posterior
      request['partner'] = partner;
      
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid webhook signature');
    }
  }
}