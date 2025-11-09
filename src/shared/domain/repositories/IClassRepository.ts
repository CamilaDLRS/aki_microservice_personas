import { ClassEntity, ClassProps } from '../entities/Class';
import { PagedResult } from './IStudentRepository';

export interface ClassQuery {
  page: number;
  size: number;
}

export interface IClassRepository {
  create(data: Omit<ClassProps, 'id'>): Promise<ClassEntity>;
  findById(id: number): Promise<ClassEntity | null>;
  findPaged(q: ClassQuery): Promise<PagedResult<ClassEntity>>;
  update(id: number, data: Partial<ClassProps>): Promise<ClassEntity | null>;
  delete(id: number): Promise<boolean>;
  addStudent(classId: number, studentId: number): Promise<void>;
  removeStudent(classId: number, studentId: number): Promise<void>;
  addTeacher(classId: number, teacherId: number): Promise<void>;
  removeTeacher(classId: number, teacherId: number): Promise<void>;
  listStudents(classId: number): Promise<number[]>;
  listTeachers(classId: number): Promise<number[]>;
}
