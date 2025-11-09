import { Student } from '../../../shared/domain/entities/Student';
import { Teacher } from '../../../shared/domain/entities/Teacher';

export interface GetClassByIdResponse {
  id: number;
  name: string;
  students: Student[];
  teachers: Teacher[];
}
