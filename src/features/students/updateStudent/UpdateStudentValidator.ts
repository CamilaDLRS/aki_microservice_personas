import { z } from 'zod';

export const updateStudentSchema = z.object({
  full_name: z.string().min(2).optional(),
  device_id: z.string().optional().nullable(),
});
