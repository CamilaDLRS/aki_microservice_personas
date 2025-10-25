import { IStudentRepository } from '../../../domain/repositories/IStudentRepository';
import { ApiError } from '../../../shared/errors/ApiError';

export async function deleteStudent(repo: IStudentRepository, id: number) {
  const ok = await repo.delete(id);
  if (!ok) {
    throw new ApiError(404, 'not_found', 'Student not found');
  }
  return ok;
}