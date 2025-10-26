import { IStudentRepository } from '../../../domain/repositories/IStudentRepository';
import { ApiError } from '../../../shared/errors/ApiError';

export async function deleteStudent(repo: IStudentRepository, id: number) {
  try {
    const ok = await repo.delete(id);
    if (!ok) {
      throw new ApiError(404, 'not_found', 'Student not found');
    }
    return ok;
  } catch (err: any) {
    // Check for FK constraint error (Sequelize or MSSQL)
    if (err && err.message && err.message.includes('REFERENCE constraint')) {
      throw new ApiError(409, 'conflict', 'Cannot delete student: student is enrolled in one or more classes. Remove from all classes before deleting.');
    }
    throw new ApiError(500, 'internal_error', 'Unexpected error deleting student', [err?.message || String(err)]);
  }
}
