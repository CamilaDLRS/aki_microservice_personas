import { ITeacherRepository } from '../../../domain/repositories/ITeacherRepository';
import { ApiError } from '../../../shared/errors/ApiError';

export async function getTeacherById(repo: ITeacherRepository, id: number) {
  const t = await repo.findById(id);
  if (!t) {
    throw new ApiError(404, 'not_found', 'Teacher not found');
  }
  return t;
}
