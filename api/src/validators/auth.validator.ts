import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    email:    z.string().email(),
    password: z.string().min(1),
  }),
});

export const subscribeSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});

export const unsubscribeSchema = z.object({
  params: z.object({
    email: z.string().email(),
  }),
});

export const createUserSchema = z.object({
  body: z.object({
    name:     z.string().min(1).max(100),
    email:    z.string().email(),
    password: z.string().min(6).max(128),
    role:     z.enum(['admin', 'manager', 'sales']).default('sales'),
    active:   z.boolean().default(true),
  }),
});

export const updateUserSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
  body: z.object({
    name:     z.string().min(1).max(100).optional(),
    email:    z.string().email().optional(),
    password: z.string().min(6).max(128).optional(),
    role:     z.enum(['admin', 'manager', 'sales']).optional(),
    active:   z.boolean().optional(),
  }),
});

export const userIdSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
});
