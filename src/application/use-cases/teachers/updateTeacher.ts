import { ITeacherRepository } from '../../../domain/repositories/ITeacherRepository';
import { ApiError } from '../../../shared/errors/ApiError';

export async function updateTeacher(repo: ITeacherRepository, id: number, data: any) {
  const t = await repo.update(id, data);
  if (!t) {
    throw new ApiError(404, 'not_found', 'Teacher not found');
  }
  return t;
}