import { IClassRepository } from '../../../shared/domain/repositories/IClassRepository';
import { ApiError } from '../../../shared/errors/ApiError';
import { UpdateClassInput } from './UpdateClassModels';

export async function updateClass(repo: IClassRepository, id: number, data: UpdateClassInput) {
  const c = await repo.update(id, data);
  if (!c) {
    throw new ApiError(404, 'not_found', 'Class not found');
  }
  return c;
}
