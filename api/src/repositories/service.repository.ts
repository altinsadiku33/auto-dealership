import { Prisma } from '@prisma/client';
import { prisma } from './prisma';

export const serviceRepository = {
  async findAll() {
    return prisma.service.findMany({ orderBy: { createdAt: 'asc' } });
  },

  async findById(id: number) {
    return prisma.service.findUnique({ where: { id } });
  },

  async create(data: Prisma.ServiceCreateInput) {
    return prisma.service.create({ data });
  },

  async update(id: number, data: Prisma.ServiceUpdateInput) {
    return prisma.service.update({ where: { id }, data });
  },

  async delete(id: number) {
    return prisma.service.delete({ where: { id } });
  },
};
