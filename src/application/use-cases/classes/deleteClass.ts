import { IClassRepository } from '../../../domain/repositories/IClassRepository';
import { ApiError } from '../../../shared/errors/ApiError';

export async function deleteClass(repo: IClassRepository, id: number) {
  const deleted = await repo.delete(id);
  if (!deleted) {
    throw new ApiError(404, 'not_found', 'Class not found');
  }
}