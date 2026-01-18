import { Expose } from 'class-transformer';

export class PartnerResponseDto {
  @Expose()
  id_partner: string;

  @Expose()
  name: string;

  @Expose()
  webhook_url: string;

  @Expose()
  secret: string;

  @Expose()
  subscribed_events: string;

  @Expose()
  is_active: boolean;

  @Expose()
  created_at: Date;
}
