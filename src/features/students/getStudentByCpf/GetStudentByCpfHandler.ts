import { Student } from '../../../shared/domain/entities/Student';
import { IStudentRepository } from '../../../shared/domain/repositories/IStudentRepository';
import { ApiError } from '../../../shared/errors/ApiError';

export const getStudentByCpf = async (
  studentRepo: IStudentRepository,
  cpf: string
): Promise<Student> => {
  const student = await studentRepo.findByCpf(cpf);

  if (!student) {
    throw new ApiError(404, 'not_found', 'Student not found');
  }

  return student;
};
