import { IClassRepository } from '../../../shared/domain/repositories/IClassRepository';
import { ApiError } from '../../../shared/errors/ApiError';

import { ClassRepository } from '../../../shared/Infrastructure/repositories/ClassRepository';
export class RemoveTeacherFromClassHandler {
  constructor(private readonly repo: IClassRepository = new ClassRepository()) {}
  async execute(classId: number, teacherId: number) {
    const cls = await this.repo.findById(classId);
    if (!cls) {
      throw new ApiError(404, 'not_found', 'Class not found');
    }
    const current = await this.repo.listTeachers(classId);
    if (!current.includes(teacherId)) {
      throw new ApiError(404, 'not_found', 'Teacher not in class');
    }
    await this.repo.removeTeacher(classId, teacherId);
  }
}
