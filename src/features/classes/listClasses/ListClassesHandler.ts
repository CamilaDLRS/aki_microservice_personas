import { IClassRepository, ClassQuery } from '../../../shared/domain/repositories/IClassRepository';

export async function listClasses(repo: IClassRepository, q: ClassQuery) {
  return repo.findPaged(q);
}
