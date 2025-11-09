import { ITeacherRepository } from '../../../shared/domain/repositories/ITeacherRepository';
import { DeleteTeacherInput } from './DeleteTeacherModels';

export async function deleteTeacher(repo: ITeacherRepository, input: DeleteTeacherInput) {
  return repo.delete(input.id);
}
