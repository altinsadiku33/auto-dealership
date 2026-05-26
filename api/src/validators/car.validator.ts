import { z } from 'zod';

export const createCarSchema = z.object({
  body: z.object({
    make:         z.string().min(1).max(80),
    model:        z.string().min(1).max(120),
    year:         z.number().int().min(1980).max(2030),
    price:        z.number().positive(),
    mileage:      z.number().int().min(0).default(0),
    category:     z.enum(['Sports', 'Supercar', 'Hypercar', 'GT', 'Electric']),
    status:       z.enum(['available', 'sold', 'reserved']).default('available'),
    color:        z.string().max(80).optional(),
    engine:       z.string().max(120).optional(),
    transmission: z.string().max(120).optional(),
    acceleration: z.string().max(40).optional(),
    topSpeed:     z.string().max(40).optional(),
    weight:       z.string().max(40).optional(),
    badge:        z.string().max(40).nullable().optional(),
    image:        z.string().url().optional(),
    description:  z.string().max(1000).optional(),
  }),
});

export const updateCarSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
  body:   createCarSchema.shape.body.partial(),
});

export const carIdSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
});

export const listCarsSchema = z.object({
  query: z.object({
    category: z.enum(['Sports', 'Supercar', 'Hypercar', 'GT', 'Electric']).optional(),
    status:   z.enum(['available', 'sold', 'reserved']).optional(),
    make:     z.string().optional(),
    search:   z.string().optional(),
  }),
});
