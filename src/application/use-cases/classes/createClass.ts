import { IClassRepository } from '../../../domain/repositories/IClassRepository';
import { ApiError } from '../../../shared/errors/ApiError';
interface Input { name: string; }
export async function createClass(repo: IClassRepository, input: Input) {
  if (!input.name || input.name.length < 2) throw new ApiError(400,'validation_error','Name too short');
  return repo.create(input);
}
