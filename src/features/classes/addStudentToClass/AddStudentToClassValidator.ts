import { z } from 'zod';

export const addStudentToClassValidator = z.object({
  student_id: z.number(),
});
