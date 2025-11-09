import { z } from 'zod';

export const createClassValidator = z.object({
  name: z.string().min(2),
});
