import { z } from 'zod';

export const updateSettingsSchema = z.object({
  body: z.object({
    dealerName:        z.string().min(1).max(100).optional(),
    tagline:           z.string().max(200).optional(),
    address:           z.string().max(300).optional(),
    phone:             z.string().max(50).optional(),
    email:             z.string().email().optional(),
    mondayFridayHours: z.string().max(50).optional(),
    saturdayHours:     z.string().max(50).optional(),
    sundayHours:       z.string().max(50).optional(),
    currency:          z.string().max(10).optional(),
    distanceUnit:      z.enum(['km', 'mi']).optional(),
  }),
});
