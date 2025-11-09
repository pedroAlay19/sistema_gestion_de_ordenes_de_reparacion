/**
 * Services Catalog
 */

import { http } from './http';
import type { Service } from '../types';

export const services = {
  getAll: () => http.get<Service[]>('/services'),
};
