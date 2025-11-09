import { IStudentRepository } from '../../../shared/domain/repositories/IStudentRepository';
import { ApiError } from '../../../shared/errors/ApiError';
import { UpdateStudentInput } from './UpdateStudentModels';

export async function updateStudent(
  repo: IStudentRepository,
  id: number,
  input: UpdateStudentInput
) {
  if (input.device_id) {
    const deviceOwner = await repo.findByDeviceId(input.device_id);
    if (deviceOwner && deviceOwner.props.id !== id) {
      throw new ApiError(409, 'conflict', 'device_id already assigned to another student');
    }
  }
  const updated = await repo.update(id, input);
  if (!updated) {
    throw new ApiError(404, 'not_found', 'Student not found');
  }
  return updated;
}
