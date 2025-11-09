import { IStudentRepository } from '../../../shared/domain/repositories/IStudentRepository';
import { ApiError } from '../../../shared/errors/ApiError';

export async function updateStudentDevice(repo: IStudentRepository, id: number, deviceId: string) {
  if (!deviceId || deviceId.length < 3) {
    throw new ApiError(400, 'validation_error', 'device_id too short');
  }
  const updated = await repo.update(id, { device_id: deviceId });
  if (!updated) {
    throw new ApiError(404, 'not_found', 'Student not found');
  }
  return updated;
}
