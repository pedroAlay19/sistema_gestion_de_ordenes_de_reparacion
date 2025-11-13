/**
 * Maintenance Services Catalog
 */

import { http } from './http';
import type { MaintenanceService } from '../types';

export const services = {
  getAll: () => http.get<MaintenanceService[]>('/services'),
  getById: (id: string) => http.get<MaintenanceService>(`/services/${id}`, true),
};
