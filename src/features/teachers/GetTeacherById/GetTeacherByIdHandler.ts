import { GetTeacherByIdInput } from './GetTeacherByIdModels';
import { TeacherRepository } from '../../../shared/Infrastructure/repositories/TeacherRepository';
import { ITeacherRepository } from '../../../shared/domain/repositories/ITeacherRepository';
import { ApiError } from '../../../shared/errors/ApiError';

export class GetTeacherByIdHandler {
  constructor(private readonly repo: ITeacherRepository = new TeacherRepository()) {}
  async execute(input: GetTeacherByIdInput) {
    const teacher = await this.repo.findById(input.id);
    if (!teacher) {
      throw new ApiError(404, 'not_found', 'Teacher not found');
    }
    return teacher;
  }
}
