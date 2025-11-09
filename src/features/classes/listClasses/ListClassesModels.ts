import { ClassProps } from '../../../shared/domain/entities/Class';
import { PagedResult } from '../../../shared/domain/repositories/IStudentRepository';

export interface ListClassesQuery {
  page: number;
  size: number;
  teacher_email?: string;
}

export type ListClassesResponse = PagedResult<ClassProps>;
