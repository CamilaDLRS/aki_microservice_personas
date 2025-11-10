import { ApiError } from '../../../shared/errors/ApiError';
import { StudentRepository } from '../../../shared/Infrastructure/repositories/StudentRepository';
import { IStudentRepository } from '../../../shared/domain/repositories/IStudentRepository';

export class DeleteStudentHandler {
  constructor(private readonly repo: IStudentRepository = new StudentRepository()) {}

  async execute(id: number) {
    try {
      const ok = await this.repo.delete(id);
      if (!ok) {
        throw new ApiError(404, 'not_found', 'Student not found');
      }
      return ok;
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes('REFERENCE constraint')) {
        throw new ApiError(
          409,
          'conflict',
          'Cannot delete student: student is enrolled in one or more classes. Remove from all classes before deleting.'
        );
      }
      const msg = err instanceof Error ? err.message : String(err);
      throw new ApiError(500, 'internal_error', 'Unexpected error deleting student', [msg]);
    }
  }
}
