import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';

@Injectable()
export class HmacService {
  sign(secret: string, timestamp: string, rawBody: Buffer): string {
    // Si no hay timestamp, solo usar el body
    const base = timestamp ? `${timestamp}.${rawBody.toString('utf8')}` : rawBody.toString('utf8');
    const hex = createHmac('sha256', secret).update(base).digest('hex');
    return `sha256=${hex}`;
  }

  verifyOrThrow(
    secret: string,
    timestamp: string,
    rawBody: Buffer,
    gotSignature: string,
  ) {
    const expected = this.sign(secret, timestamp, rawBody);

    // timing-safe compare (mismo largo)
    const a = Buffer.from(expected);
    const b = Buffer.from(gotSignature ?? '');

    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      throw new UnauthorizedException('Firma HMAC inválida');
    }
  }
}