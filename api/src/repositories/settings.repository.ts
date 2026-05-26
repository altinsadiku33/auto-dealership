import { prisma } from './prisma';

export const settingsRepository = {
  async get() {
    return prisma.settings.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1 },
    });
  },

  async update(data: Partial<{
    dealerName: string;
    tagline: string;
    address: string;
    phone: string;
    email: string;
    mondayFridayHours: string;
    saturdayHours: string;
    sundayHours: string;
  }>) {
    return prisma.settings.upsert({
      where: { id: 1 },
      create: { id: 1, ...data },
      update: data,
    });
  },
};
