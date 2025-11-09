import { z } from 'zod';

export const createStudentSchema = z.object({
  cpf: z.string().length(11),
  full_name: z.string().min(2),
  device_id: z.string().optional().nullable(),
});
