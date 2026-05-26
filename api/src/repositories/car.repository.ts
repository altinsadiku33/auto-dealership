import { Prisma } from '@prisma/client';
import { prisma } from './prisma';

export interface CarFilters {
  category?: string;
  status?: string;
  make?: string;
  search?: string;
}

const withImages = { images: { orderBy: { order: 'asc' as const } } };

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
    return prisma.car.findMany({ where, orderBy: { createdAt: 'desc' }, include: withImages });
  },

  async findById(id: number) {
    return prisma.car.findUnique({ where: { id }, include: withImages });
  },

  async create(data: Prisma.CarCreateInput) {
    return prisma.car.create({ data, include: withImages });
  },

  async update(id: number, data: Prisma.CarUpdateInput) {
    return prisma.car.update({ where: { id }, data, include: withImages });
  },

  async delete(id: number) {
    return prisma.car.delete({ where: { id } });
  },

  async addImage(carId: number, url: string, order: number) {
    return prisma.carImage.create({ data: { carId, url, order } });
  },

  async deleteImage(id: number) {
    return prisma.carImage.delete({ where: { id } });
  },

  async findImage(id: number) {
    return prisma.carImage.findUnique({ where: { id } });
  },
};
