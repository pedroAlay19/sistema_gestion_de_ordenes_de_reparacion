import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { Partner } from './entities/partner.entity';
import { PartnerRegisterDto } from './dto/partner-register.dto';

@Injectable()
export class PartnerService {
  private readonly logger = new Logger(PartnerService.name);

  constructor(
    @InjectRepository(Partner)
    private readonly partnerRepository: Repository<Partner>,
  ) {}

  /**
   * Registra un nuevo partner y genera un secret compartido.
   * El secret se genera usando crypto.randomBytes de Node.js.
   */
  async register(partnerData: PartnerRegisterDto): Promise<Partner> {
    const secret = this.generateSecret(32);

    const partner = this.partnerRepository.create({
      ...partnerData,
      secret,
      subscribed_events: partnerData.subscribed_events 
        ? JSON.stringify(partnerData.subscribed_events)
        : undefined,
      is_active: true,
    });

    const savedPartner = await this.partnerRepository.save(partner);

    this.logger.log(`Partner registrado: ${savedPartner.name} (${savedPartner.id_partner})`);

    return savedPartner;
  }

  /**
   * Lista todos los partners activos.
   */
  async findAll(): Promise<Partner[]> {
    return this.partnerRepository.find({
      where: { is_active: true },
    });
  }

  /**
   * Obtiene un partner específico por ID.
   */
  async findOne(id: string): Promise<Partner> {
    const partner = await this.partnerRepository.findOneBy({ 
      id_partner: id 
    });

    if (!partner) {
      throw new NotFoundException(`Partner con ID ${id} no encontrado`);
    }

    return partner;
  }

  /**
   * Desactiva un partner (soft delete).
   */
  async deactivate(id: string): Promise<void> {
    const partner = await this.findOne(id);

    await this.partnerRepository.update(id, { is_active: false });

    this.logger.log(`Partner desactivado: ${partner.name} (${id})`);
  }

  /**
   * Busca partners suscritos a un evento específico.
   */
  async findByEvent(eventType: string): Promise<Partner[]> {
    const partners = await this.findAll();

    return partners.filter((partner) => {
      if (!partner.subscribed_events) return false;

      try {
        const events: string[] = JSON.parse(partner.subscribed_events);
        return events.includes(eventType);
      } catch {
        return false;
      }
    });
  }

  /**
   * Genera un secret aleatorio URL-safe usando Node.js crypto.
   */
  private generateSecret(length: number): string {
    return randomBytes(length)
      .toString('base64url')
      .slice(0, length);
  }
}
