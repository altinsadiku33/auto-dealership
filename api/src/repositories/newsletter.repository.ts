import { prisma } from './prisma';

export const newsletterRepository = {
  async findAll() {
    return prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: 'desc' } });
  },

  async findByEmail(email: string) {
    return prisma.newsletterSubscriber.findUnique({ where: { email } });
  },

  async create(email: string) {
    return prisma.newsletterSubscriber.create({ data: { email } });
  },

  async delete(email: string) {
    return prisma.newsletterSubscriber.delete({ where: { email } });
  },

  async count() {
    return prisma.newsletterSubscriber.count();
  },
};
