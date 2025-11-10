import { ListTeachersInput, ListTeachersOutput } from './ListTeachersModels';
import { TeacherRepository } from '../../../shared/Infrastructure/repositories/TeacherRepository';
import { ITeacherRepository } from '../../../shared/domain/repositories/ITeacherRepository';

export class ListTeachersHandler {
  constructor(private readonly repo: ITeacherRepository = new TeacherRepository()) {}
  async execute(input: ListTeachersInput): Promise<ListTeachersOutput> {
    return this.repo.findPaged(input);
  }
}
