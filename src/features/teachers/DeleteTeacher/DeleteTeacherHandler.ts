import { DeleteTeacherInput } from './DeleteTeacherModels';
import { TeacherRepository } from '../../../shared/Infrastructure/repositories/TeacherRepository';
import { ITeacherRepository } from '../../../shared/domain/repositories/ITeacherRepository';
import { ApiError } from '../../../shared/errors/ApiError';

export class DeleteTeacherHandler {
  constructor(private readonly repo: ITeacherRepository = new TeacherRepository()) {}
  async execute(input: DeleteTeacherInput) {
    const ok = await this.repo.delete(input.id);
    if (!ok) {
      throw new ApiError(404, 'not_found', 'Teacher not found');
    }
    return ok;
  }
}
