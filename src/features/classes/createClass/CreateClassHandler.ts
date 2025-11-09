import { IClassRepository } from '../../../shared/domain/repositories/IClassRepository';
import { ApiError } from '../../../shared/errors/ApiError';
import { CreateClassInput } from './CreateClassModels';

export async function createClass(repo: IClassRepository, input: CreateClassInput) {
  if (!input.name || input.name.length < 2) {
    throw new ApiError(400, 'validation_error', 'Name too short');
  }
  return repo.create(input);
}
