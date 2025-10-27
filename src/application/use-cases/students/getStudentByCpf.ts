import { IStudentRepository } from '../../../domain/repositories/IStudentRepository';
import { ApiError } from '../../../shared/errors/ApiError';

export async function getStudentByCpf(repo: IStudentRepository, cpf: string) {
  const student = await repo.findByCpf(cpf);
  if (!student) {
    throw new ApiError(404, 'not_found', 'Student not found');
  }
  return student;
}
