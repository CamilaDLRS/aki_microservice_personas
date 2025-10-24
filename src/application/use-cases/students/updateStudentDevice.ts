import { IStudentRepository } from '../../../domain/repositories/IStudentRepository';
import { ApiError } from '../../../shared/errors/ApiError';

export async function updateStudentDevice(repo: IStudentRepository, id: number, device_id: string) {
  if (!device_id || device_id.length < 3) throw new ApiError(400,'validation_error','device_id too short');
  const updated = await repo.update(id, { device_id });
  if (!updated) throw new ApiError(404,'not_found','Student not found');
  return updated;
}