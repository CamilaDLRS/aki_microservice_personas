import { IClassRepository } from '../../../shared/domain/repositories/IClassRepository';
import { IStudentRepository } from '../../../shared/domain/repositories/IStudentRepository';
import { ApiError } from '../../../shared/errors/ApiError';

export async function addStudentToClass(
  classRepo: IClassRepository,
  studentRepo: IStudentRepository,
  classId: number,
  studentId: number
) {
  const cls = await classRepo.findById(classId);
  if (!cls) {
    throw new ApiError(404, 'not_found', 'Class not found');
  }
  const student = await studentRepo.findById(studentId);
  if (!student) {
    throw new ApiError(404, 'not_found', 'Student not found');
  }
  // Prevent duplicate link (optional optimization)
  const existingIds = await classRepo.listStudents(classId);
  if (existingIds.includes(studentId)) {
    throw new ApiError(409, 'conflict', 'Student already in class');
  }
  await classRepo.addStudent(classId, studentId);
}
