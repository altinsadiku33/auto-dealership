import { Prisma } from '@prisma/client';
import { prisma } from './prisma';

export interface CarFilters {
  category?: string;
  status?: string;
  make?: string;
  search?: string;
}

export const carRepository = {
  async findAll(filters: CarFilters = {}) {
    const where: Prisma.CarWhereInput = {};
    if (filters.category) where.category = filters.category;
    if (filters.status)   where.status   = filters.status;
    if (filters.make)     where.make     = { contains: filters.make };
    if (filters.search)   where.OR = [
      { make:  { contains: filters.search } },
      { model: { contains: filters.search } },
    ];
    return prisma.car.findMany({ where, orderBy: { createdAt: 'desc' } });
  },

  async findById(id: number) {
    return prisma.car.findUnique({ where: { id } });
  },

  async create(data: Prisma.CarCreateInput) {
    return prisma.car.create({ data });
  },

  async update(id: number, data: Prisma.CarUpdateInput) {
    return prisma.car.update({ where: { id }, data });
  },

  async delete(id: number) {
    return prisma.car.delete({ where: { id } });
  },
};
