import { IClassRepository } from '../../../shared/domain/repositories/IClassRepository';
import { ApiError } from '../../../shared/errors/ApiError';
import { UpdateClassInput } from './UpdateClassModels';

import { ClassRepository } from '../../../shared/Infrastructure/repositories/ClassRepository';
export class UpdateClassHandler {
  constructor(private readonly repo: IClassRepository = new ClassRepository()) {}
  async execute(id: number, data: UpdateClassInput) {
    const c = await this.repo.update(id, data);
    if (!c) {
      throw new ApiError(404, 'not_found', 'Class not found');
    }
    return c;
  }
}
