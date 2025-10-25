import { IClassRepository, ClassQuery } from '../../../domain/repositories/IClassRepository';

export async function listClasses(repo: IClassRepository, q: ClassQuery) {
  return repo.findPaged(q);
}
