import { Prisma } from '@prisma/client';
import { prisma } from './prisma';

export const userRepository = {
  async findAll() {
    return prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });
  },

  async findById(id: number) {
    return prisma.user.findUnique({ where: { id } });
  },

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data });
  },

  async update(id: number, data: Prisma.UserUpdateInput) {
    return prisma.user.update({ where: { id }, data });
  },

  async delete(id: number) {
    return prisma.user.delete({ where: { id } });
  },
};
