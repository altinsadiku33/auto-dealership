import { z } from 'zod';

export const createInquirySchema = z.object({
  body: z.object({
    name:    z.string().min(1).max(100),
    email:   z.string().email(),
    phone:   z.string().max(30).optional(),
    subject: z.string().min(1).max(120),
    vehicle: z.string().max(200).optional(),
    message: z.string().min(1).max(2000),
  }),
});

export const updateInquirySchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
  body: z.object({
    status:        z.enum(['new', 'replied', 'closed']).optional(),
    pipelineStage: z.enum(['new', 'replied', 'test_drive', 'negotiate', 'closed']).optional().nullable(),
    assignedToId:  z.coerce.number().int().positive().optional().nullable(),
  }),
});

export const inquiryIdSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
});
