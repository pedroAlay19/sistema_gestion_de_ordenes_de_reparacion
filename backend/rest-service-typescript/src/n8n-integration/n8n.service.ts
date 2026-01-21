import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import {
  RepairOrderCreatedEvent,
  RepairOrderStatusChangedEvent,
  TechnicianTaskAssignedEvent,
} from './dto/notification-event.dto';

@Injectable()
export class N8nService {
  private readonly logger = new Logger(N8nService.name);
  private readonly n8nBaseUrl: string;
  private readonly isEnabled: boolean;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.n8nBaseUrl = this.configService.get<string>(
      'N8N_WEBHOOK_URL',
      'http://localhost:5678/webhook',
    );
    this.isEnabled = this.configService.get<string>('NODE_ENV') !== 'test';
  }

  /**
   * Dispara evento cuando se crea una nueva orden de reparación
   */
  async notifyRepairOrderCreated(
    event: RepairOrderCreatedEvent,
  ): Promise<void> {
    if (!this.isEnabled) {
      this.logger.debug('n8n deshabilitado en ambiente de pruebas');
      return;
    }

    try {
      const url = `${this.n8nBaseUrl}/repair-order-created`;
      
      this.logger.log(
        `Enviando evento repair-order-created para orden ${event.orderId}`,
      );

      await firstValueFrom(
        this.httpService.post(url, {
          ...event,
          timestamp: new Date().toISOString(),
          eventType: 'repair_order_created',
        }),
      );

      this.logger.log(
        `✅ Evento enviado exitosamente para orden ${event.orderId}`,
      );
    } catch (error) {
      this.logger.error(
        `❌ Error enviando evento repair-order-created: ${error.message}`,
      );
      // No lanzamos el error para no bloquear el flujo principal
    }
  }

  /**
   * Dispara evento cuando cambia el estado de una orden
   */
  async notifyRepairOrderStatusChanged(
    event: RepairOrderStatusChangedEvent,
  ): Promise<void> {
    if (!this.isEnabled) return;

    try {
      const url = `${this.n8nBaseUrl}/repair-order-status`;

      this.logger.log(
        `Enviando cambio de estado: ${event.previousStatus} → ${event.newStatus} (Orden: ${event.orderId})`,
      );

      await firstValueFrom(
        this.httpService.post(url, {
          ...event,
          timestamp: new Date().toISOString(),
          eventType: 'repair_order_status_changed',
        }),
      );

      this.logger.log(`✅ Notificación de cambio de estado enviada`);
    } catch (error) {
      this.logger.error(
        `❌ Error enviando cambio de estado: ${error.message}`,
      );
    }
  }

  /**
   * Dispara evento cuando se asigna una tarea a un técnico
   */
  async notifyTechnicianTaskAssigned(
    event: TechnicianTaskAssignedEvent,
  ): Promise<void> {
    if (!this.isEnabled) return;

    try {
      const url = `${this.n8nBaseUrl}/task-assigned`;

      this.logger.log(
        `Asignando tarea "${event.serviceName}" a técnico ${event.technicianName}`,
      );

      await firstValueFrom(
        this.httpService.post(url, {
          ...event,
          timestamp: new Date().toISOString(),
          eventType: 'technician_task_assigned',
        }),
      );

      this.logger.log(`✅ Notificación de tarea enviada`);
    } catch (error) {
      this.logger.error(`❌ Error enviando tarea asignada: ${error.message}`);
    }
  }

  /**
   * Método genérico para disparar cualquier evento personalizado
   */
  async triggerCustomEvent(
    webhookPath: string,
    payload: Record<string, any>,
  ): Promise<void> {
    if (!this.isEnabled) return;

    try {
      const url = `${this.n8nBaseUrl}/${webhookPath}`;

      await firstValueFrom(
        this.httpService.post(url, {
          ...payload,
          timestamp: new Date().toISOString(),
        }),
      );

      this.logger.log(`✅ Evento personalizado enviado: ${webhookPath}`);
    } catch (error) {
      this.logger.error(
        `❌ Error enviando evento personalizado ${webhookPath}: ${error.message}`,
      );
    }
  }
}