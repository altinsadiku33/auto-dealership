import { inquiryRepository } from '../repositories/inquiry.repository';
import { NotFoundError, ForbiddenError } from '../middlewares/app-error';
import { ERROR_CODES } from '../constants/errors';
import { z } from 'zod';
import { createInquirySchema, updateInquirySchema } from '../validators/inquiry.validator';

type CreateInquiryInput = z.infer<typeof createInquirySchema>['body'];
type UpdateInquiryInput = z.infer<typeof updateInquirySchema>['body'];

interface Caller {
  userId: number;
  role: string;
}

export const inquiryService = {
  async listInquiries(caller?: Caller, status?: string) {
    return inquiryRepository.findAll({
      status,
      role: caller?.role,
      userId: caller?.userId,
    });
  },

  async getInquiry(id: number, caller?: Caller) {
    const inquiry = await inquiryRepository.findById(id);
    if (!inquiry) throw new NotFoundError(ERROR_CODES.INQUIRY_NOT_FOUND, 'Inquiry');
    if (caller?.role === 'sales' && inquiry.assignedToId !== caller.userId) {
      throw new ForbiddenError();
    }
    return inquiry;
  },

  async createInquiry(data: CreateInquiryInput) {
    return inquiryRepository.create(data);
  },

  async updateInquiry(id: number, data: UpdateInquiryInput, caller?: Caller) {
    await this.getInquiry(id, caller);
    const { assignedToId, ...rest } = data as UpdateInquiryInput & { assignedToId?: number | null };
    const updateData: Record<string, unknown> = { ...rest };
    if (assignedToId !== undefined) {
      updateData['assignedTo'] = assignedToId === null
        ? { disconnect: true }
        : { connect: { id: assignedToId } };
    }
    return inquiryRepository.update(id, updateData);
  },

  async deleteInquiry(id: number, caller?: Caller) {
    await this.getInquiry(id, caller);
    return inquiryRepository.delete(id);
  },
};
