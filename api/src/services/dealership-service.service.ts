import { serviceRepository } from '../repositories/service.repository';
import { NotFoundError } from '../middlewares/app-error';
import { ERROR_CODES } from '../constants/errors';
import { z } from 'zod';
import { createServiceSchema, updateServiceSchema } from '../validators/service.validator';

type CreateServiceInput = z.infer<typeof createServiceSchema>['body'];
type UpdateServiceInput = z.infer<typeof updateServiceSchema>['body'];

export const dealershipServiceService = {
  async listServices() {
    return serviceRepository.findAll();
  },

  async getService(id: number) {
    const service = await serviceRepository.findById(id);
    if (!service) throw new NotFoundError(ERROR_CODES.SERVICE_NOT_FOUND, 'Service');
    return service;
  },

  async createService(data: CreateServiceInput) {
    return serviceRepository.create(data);
  },

  async updateService(id: number, data: UpdateServiceInput) {
    await this.getService(id);
    return serviceRepository.update(id, data);
  },

  async deleteService(id: number) {
    await this.getService(id);
    return serviceRepository.delete(id);
  },
};
