import { UpdateTeacherInput } from './UpdateTeacherModels';
import { TeacherRepository } from '../../../shared/Infrastructure/repositories/TeacherRepository';
import { ITeacherRepository } from '../../../shared/domain/repositories/ITeacherRepository';
import { ApiError } from '../../../shared/errors/ApiError';

export class UpdateTeacherHandler {
  constructor(private readonly repo: ITeacherRepository = new TeacherRepository()) {}
  async execute(input: UpdateTeacherInput) {
    const { id, ...data } = input;
    const updated = await this.repo.update(id, data);
    if (!updated) {
      throw new ApiError(404, 'not_found', 'Teacher not found');
    }
    return updated;
  }
}
