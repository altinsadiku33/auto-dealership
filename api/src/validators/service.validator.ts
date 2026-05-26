import { z } from 'zod';

export const createServiceSchema = z.object({
  body: z.object({
    icon:        z.string().max(10).default('◈'),
    name:        z.string().min(1).max(120),
    description: z.string().min(1).max(500),
    price:       z.string().max(60),
    active:      z.boolean().default(true),
  }),
});

export const updateServiceSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
  body:   createServiceSchema.shape.body.partial(),
});

export const serviceIdSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
});
