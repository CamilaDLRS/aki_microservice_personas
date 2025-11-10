import { StudentQuery, IStudentRepository } from '../../../shared/domain/repositories/IStudentRepository';
import { StudentRepository } from '../../../shared/Infrastructure/repositories/StudentRepository';

export class ListStudentsHandler {
  constructor(private readonly repo: IStudentRepository = new StudentRepository()) {}
  async execute(query: StudentQuery) {
    return this.repo.findPaged(query);
  }
}
