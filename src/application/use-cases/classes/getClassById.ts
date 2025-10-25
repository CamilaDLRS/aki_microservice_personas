import { IClassRepository } from '../../../domain/repositories/IClassRepository';
import { ApiError } from '../../../shared/errors/ApiError';

export async function getClassById(repo: IClassRepository, id: number) {
  const c = await repo.findById(id);
  if (!c) {
    throw new ApiError(404, 'not_found', 'Class not found');
  }
  return c;
}