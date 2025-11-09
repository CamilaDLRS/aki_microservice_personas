import { z } from 'zod';

export const createTeacherValidator = z.object({
  cpf: z.string().length(11),
  full_name: z.string(),
  email: z.string().email(),
  password_hash: z.string().optional().nullable(),
});
