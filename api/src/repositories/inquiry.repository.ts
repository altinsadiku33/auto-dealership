import { Prisma } from '@prisma/client';
import { prisma } from './prisma';

export interface InquiryFilters {
  status?: string;
  role?: string;
  userId?: number;
}

export const inquiryRepository = {
  async findAll(filters: InquiryFilters = {}) {
    const where: Prisma.InquiryWhereInput = {};
    if (filters.status) where.status = filters.status;
    if (filters.role === 'sales') where.assignedToId = filters.userId;

    return prisma.inquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { assignedTo: { select: { id: true, name: true } } },
    });
  },

  async findById(id: number) {
    return prisma.inquiry.findUnique({
      where: { id },
      include: { assignedTo: { select: { id: true, name: true } } },
    });
  },

  async create(data: Prisma.InquiryCreateInput) {
    return prisma.inquiry.create({
      data,
      include: { assignedTo: { select: { id: true, name: true } } },
    });
  },

  async update(id: number, data: Prisma.InquiryUpdateInput) {
    return prisma.inquiry.update({
      where: { id },
      data,
      include: { assignedTo: { select: { id: true, name: true } } },
    });
  },

  async delete(id: number) {
    return prisma.inquiry.delete({ where: { id } });
  },
};
