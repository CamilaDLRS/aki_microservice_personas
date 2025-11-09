import { Student } from '../../../shared/domain/entities/Student';
import { IStudentRepository } from '../../../shared/domain/repositories/IStudentRepository';
import { ApiError } from '../../../shared/errors/ApiError';

export const getStudentById = async (
  studentRepo: IStudentRepository,
  studentId: string
): Promise<Student> => {
  const student = await studentRepo.findById(Number(studentId));

  if (!student) {
    throw new ApiError(404, 'not_found', 'Student not found');
  }

  return student;
};
