import { Teacher, TeacherProps } from '../entities/Teacher';
import { PagedResult } from './IStudentRepository';

export interface TeacherQuery {
  page: number;
  size: number;
}

export interface ITeacherRepository {
  create(data: Omit<TeacherProps, 'id'>): Promise<Teacher>;
  findById(id: number): Promise<Teacher | null>;
  findPaged(q: TeacherQuery): Promise<PagedResult<Teacher>>;
  update(id: number, data: Partial<TeacherProps>): Promise<Teacher | null>;
  delete(id: number): Promise<boolean>;
}
