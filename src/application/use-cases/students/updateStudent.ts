import { IStudentRepository } from '../../../domain/repositories/IStudentRepository';
import { ApiError } from '../../../shared/errors/ApiError';

interface Input { full_name?: string; device_id?: string | null; }
export async function updateStudent(repo: IStudentRepository, id: number, input: Input) {
  const updated = await repo.update(id, input);
  if (!updated) throw new ApiError(404, 'not_found', 'Student not found');
  return updated;
}
