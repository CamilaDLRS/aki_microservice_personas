import { IStudentRepository } from '../../../shared/domain/repositories/IStudentRepository';
import { ITeacherRepository } from '../../../shared/domain/repositories/ITeacherRepository';
import { PagedResult } from '../../../shared/domain/repositories/IStudentRepository';
import { Teacher } from '../../../shared/domain/entities/Teacher';

export interface ListTeachersInput {
  page: number;
  size: number;
}

export type ListTeachersOutput = PagedResult<Teacher>;
