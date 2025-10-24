import { ITeacherRepository, TeacherQuery } from '../../../domain/repositories/ITeacherRepository';
export async function listTeachers(repo: ITeacherRepository, q: TeacherQuery) { return repo.findPaged(q); }
