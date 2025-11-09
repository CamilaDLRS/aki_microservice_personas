import { z } from 'zod';

export const recoverPasswordValidator = z.object({
  teacher_email: z.string().email(),
});
