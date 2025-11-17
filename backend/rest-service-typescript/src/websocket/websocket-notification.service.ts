import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class WebSocketNotificationService {
  private readonly WEBSOCKET_URL = process.env.WEBSOCKET_URL || 'http://localhost:8081';

  async notifyDashboardUpdate(eventType: string, resourceId?: string): Promise<void> {
    try {
      const payload = {
        event: 'DASHBOARD_UPDATE',
        type: eventType,
        resourceId,
        timestamp: new Date().toISOString(),
      };

      await axios.post(`${this.WEBSOCKET_URL}/notify`, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 3000,
      });

      console.log(`Dashboard update sent: ${eventType}`);
    } catch (error) {
      console.error(`Failed to send dashboard notification:`, error);
    }
  }
}
