import { z } from 'zod';

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(8),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

// Dog schemas
export const createDogSchema = z.object({
  name: z.string().min(1).max(100),
  sex: z.enum(['MALE', 'FEMALE', 'UNKNOWN']),
  approxBirthdate: z.string().datetime().optional().nullable(),
  breed: z.string().max(100).optional().nullable(),
  size: z.enum(['SMALL', 'MEDIUM', 'LARGE', 'XL', 'UNKNOWN']),
  weightKg: z.number().positive().max(200).optional().nullable(),
  microchipId: z.string().max(50).optional().nullable(),
  intakeDate: z.string().datetime().optional().nullable(),
  status: z.enum(['AVAILABLE', 'ON_HOLD', 'ADOPTED', 'FOSTERED', 'MEDICAL', 'UNKNOWN']),
  description: z.string().max(2000).optional().nullable(),
});

export const updateDogSchema = createDogSchema.partial();

export const dogFilterSchema = z.object({
  status: z.enum(['AVAILABLE', 'ON_HOLD', 'ADOPTED', 'FOSTERED', 'MEDICAL', 'UNKNOWN']).optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

// Types
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type CreateDogInput = z.infer<typeof createDogSchema>;
export type UpdateDogInput = z.infer<typeof updateDogSchema>;
export type DogFilterInput = z.infer<typeof dogFilterSchema>;
