import { ITeacherRepository } from '../../../shared/domain/repositories/ITeacherRepository';
import { ListTeachersInput, ListTeachersOutput } from './ListTeachersModels';

export async function listTeachers(
  repo: ITeacherRepository,
  input: ListTeachersInput
): Promise<ListTeachersOutput> {
  return repo.findPaged(input);
}
