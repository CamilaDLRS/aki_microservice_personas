import { z } from 'zod';

export const addTeacherToClassValidator = z.object({
  teacher_id: z.number(),
});
