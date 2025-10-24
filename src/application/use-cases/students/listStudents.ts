import { IStudentRepository, StudentQuery } from '../../../domain/repositories/IStudentRepository';

export async function listStudents(repo: IStudentRepository, query: StudentQuery) {
  return repo.findPaged(query);
}
