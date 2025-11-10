import { IClassRepository } from '../../../shared/domain/repositories/IClassRepository';
import { ApiError } from '../../../shared/errors/ApiError';

import { ClassRepository } from '../../../shared/Infrastructure/repositories/ClassRepository';
export class RemoveStudentFromClassHandler {
  constructor(private readonly repo: IClassRepository = new ClassRepository()) {}
  async execute(classId: number, studentId: number) {
    const cls = await this.repo.findById(classId);
    if (!cls) {
      throw new ApiError(404, 'not_found', 'Class not found');
    }
    const current = await this.repo.listStudents(classId);
    if (!current.includes(studentId)) {
      throw new ApiError(404, 'not_found', 'Student not in class');
    }
    await this.repo.removeStudent(classId, studentId);
  }
}
