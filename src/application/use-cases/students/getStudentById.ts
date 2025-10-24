import { IStudentRepository } from '../../../domain/repositories/IStudentRepository';
import { ApiError } from '../../../shared/errors/ApiError';

export async function getStudentById(repo: IStudentRepository, id: number) {
  const student = await repo.findById(id);
  if (!student) throw new ApiError(404, 'not_found', 'Student not found');
  return student;
}
