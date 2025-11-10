import { IClassRepository } from '../../../shared/domain/repositories/IClassRepository';
import { ApiError } from '../../../shared/errors/ApiError';

import { ClassRepository } from '../../../shared/Infrastructure/repositories/ClassRepository';
export class DeleteClassHandler {
  constructor(private readonly repo: IClassRepository = new ClassRepository()) {}
  async execute(id: number) {
    const deleted = await this.repo.delete(id);
    if (!deleted) {
      throw new ApiError(404, 'not_found', 'Class not found');
    }
  }
}
