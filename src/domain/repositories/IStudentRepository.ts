import { Student, StudentProps } from '../entities/Student';

export interface StudentQuery {
  page: number;
  size: number;
  q?: string;
}

export interface PagedResult<T> {
  meta: { page: number; size: number; total: number };
  items: T[];
}

export interface IStudentRepository {
  create(data: Omit<StudentProps, 'id'>): Promise<Student>;
  findById(id: number): Promise<Student | null>;
  findByCpf(cpf: string): Promise<Student | null>;
  findPaged(query: StudentQuery): Promise<PagedResult<Student>>;
  update(id: number, data: Partial<StudentProps>): Promise<Student | null>;
  delete(id: number): Promise<boolean>;
}
