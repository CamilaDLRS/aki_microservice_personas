import { IClassRepository } from '../../../shared/domain/repositories/IClassRepository';
import { ITeacherRepository } from '../../../shared/domain/repositories/ITeacherRepository';
import { ApiError } from '../../../shared/errors/ApiError';

import { ClassRepository } from '../../../shared/Infrastructure/repositories/ClassRepository';
import { TeacherRepository } from '../../../shared/Infrastructure/repositories/TeacherRepository';
export class AddTeacherToClassHandler {
  constructor(
    private readonly classRepo: IClassRepository = new ClassRepository(),
    private readonly teacherRepo: ITeacherRepository = new TeacherRepository()
  ) {}
  async execute(classId: number, teacherId: number) {
    const cls = await this.classRepo.findById(classId);
    if (!cls) {
      throw new ApiError(404, 'not_found', 'Class not found');
    }
    const teacher = await this.teacherRepo.findById(teacherId);
    if (!teacher) {
      throw new ApiError(404, 'not_found', 'Teacher not found');
    }
    const existingIds = await this.classRepo.listTeachers(classId);
    if (existingIds.includes(teacherId)) {
      throw new ApiError(409, 'conflict', 'Teacher already in class');
    }
    await this.classRepo.addTeacher(classId, teacherId);
  }
}
