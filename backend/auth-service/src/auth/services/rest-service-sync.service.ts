import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';

@Injectable()
export class RestServiceSyncService {
  private readonly logger = new Logger(RestServiceSyncService.name);
  private readonly restServiceUrl: string;

  constructor(private configService: ConfigService) {
    this.restServiceUrl =
      this.configService.get<string>('REST_SERVICE_URL') ||
      'http://localhost:3000';
  }

  async syncUserProfile(user: User): Promise<void> {
    try {
      const syncData = {
        authUserId: user.id,
        role: user.role,
        name: user.name,
        email: user.email
      };

      const response = await fetch(`${this.restServiceUrl}/users/sync/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(syncData),
      });

      if (!response.ok) {
        const error = await response.text();
        this.logger.warn(
          `Failed to sync user profile: ${response.status} - ${error}`,
        );
        return;
      }

      this.logger.log(`User profile synced successfully: ${user.id}`);
    } catch (error) {
      this.logger.error(
        `Error syncing user profile: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error.stack : undefined,
      );
    }
  }


  async syncTechnicianProfile(user: User, specialty?: string): Promise<void> {
    try {
      const syncData = {
        authUserId: user.id,
        role: user.role,
        name: user.name,
        email: user.email,
        specialty: specialty || 'Por definir',
      };

      const response = await fetch(
        `${this.restServiceUrl}/users/sync/technician`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(syncData),
        },
      );

      if (!response.ok) {
        const error = await response.text();
        this.logger.warn(
          `Failed to sync technician profile: ${response.status} - ${error}`,
        );
        return;
      }

      this.logger.log(`Technician profile synced successfully: ${user.id}`);
    } catch (error) {
      this.logger.error(
        `Error syncing technician profile: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error.stack : undefined,
      );
    }
  }
}
