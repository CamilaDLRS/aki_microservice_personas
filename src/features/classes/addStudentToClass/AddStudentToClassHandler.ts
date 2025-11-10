import { IClassRepository } from '../../../shared/domain/repositories/IClassRepository';
import { IStudentRepository } from '../../../shared/domain/repositories/IStudentRepository';
import { ApiError } from '../../../shared/errors/ApiError';

import { ClassRepository } from '../../../shared/Infrastructure/repositories/ClassRepository';
import { StudentRepository } from '../../../shared/Infrastructure/repositories/StudentRepository';
export class AddStudentToClassHandler {
  constructor(
    private readonly classRepo: IClassRepository = new ClassRepository(),
    private readonly studentRepo: IStudentRepository = new StudentRepository()
  ) {}
  async execute(classId: number, studentId: number) {
    const cls = await this.classRepo.findById(classId);
    if (!cls) {
      throw new ApiError(404, 'not_found', 'Class not found');
    }
    const student = await this.studentRepo.findById(studentId);
    if (!student) {
      throw new ApiError(404, 'not_found', 'Student not found');
    }
    const existingIds = await this.classRepo.listStudents(classId);
    if (existingIds.includes(studentId)) {
      throw new ApiError(409, 'conflict', 'Student already in class');
    }
    await this.classRepo.addStudent(classId, studentId);
  }
}
