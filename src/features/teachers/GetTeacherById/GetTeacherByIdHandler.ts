import { ITeacherRepository } from '../../../shared/domain/repositories/ITeacherRepository';
import { GetTeacherByIdInput } from './GetTeacherByIdModels';

export async function getTeacherById(repo: ITeacherRepository, input: GetTeacherByIdInput) {
  return repo.findById(input.id);
}
