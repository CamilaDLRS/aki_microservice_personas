import { z } from 'zod';

export const updateStudentDeviceSchema = z.object({
  deviceId: z.string().min(3),
});

export type UpdateStudentDeviceInput = z.infer<typeof updateStudentDeviceSchema>;
