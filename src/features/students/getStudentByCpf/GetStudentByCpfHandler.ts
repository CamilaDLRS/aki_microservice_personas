import { Student } from '../../../shared/domain/entities/Student';
import { ApiError } from '../../../shared/errors/ApiError';
import { StudentRepository } from '../../../shared/Infrastructure/repositories/StudentRepository';
import { IStudentRepository } from '../../../shared/domain/repositories/IStudentRepository';

export class GetStudentByCpfHandler {
  constructor(private readonly repo: IStudentRepository = new StudentRepository()) {}

  async execute(cpf: string): Promise<Student> {
    const student = await this.repo.findByCpf(cpf);
    if (!student) {
      throw new ApiError(404, 'not_found', 'Student not found');
    }
    return student;
  }
}
