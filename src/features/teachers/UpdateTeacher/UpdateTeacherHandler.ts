import { ITeacherRepository } from '../../../shared/domain/repositories/ITeacherRepository';
import { UpdateTeacherInput } from './UpdateTeacherModels';

export async function updateTeacher(repo: ITeacherRepository, input: UpdateTeacherInput) {
  const { id, ...data } = input;
  return repo.update(id, data);
}
