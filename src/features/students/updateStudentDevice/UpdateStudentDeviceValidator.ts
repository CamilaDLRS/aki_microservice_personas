import { z } from 'zod';

export const updateStudentDeviceSchema = z.object({
  device_id: z.string().min(3),
});
