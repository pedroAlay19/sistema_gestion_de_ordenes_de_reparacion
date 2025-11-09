/**
 * Notification Types
 * Tipos relacionados con notificaciones del sistema
 */

export interface Notification {
  id: string;
  title: string;
  message: string;
  sentAt: string;
  status: 'SENT' | 'READ';
  createdAt: string;
}
