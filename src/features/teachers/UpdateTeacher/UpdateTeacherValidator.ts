import { z } from 'zod';

export const updateTeacherValidator = z.object({
  full_name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password_hash: z.string().optional().nullable(),
});
