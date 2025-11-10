import { IClassRepository } from '../../../shared/domain/repositories/IClassRepository';
import { IStudentRepository } from '../../../shared/domain/repositories/IStudentRepository';
import { ITeacherRepository } from '../../../shared/domain/repositories/ITeacherRepository';
import { ClassRepository } from '../../../shared/Infrastructure/repositories/ClassRepository';
import { StudentRepository } from '../../../shared/Infrastructure/repositories/StudentRepository';
import { TeacherRepository } from '../../../shared/Infrastructure/repositories/TeacherRepository';
import { ApiError } from '../../../shared/errors/ApiError';

export class GetClassByIdFullHandler {
  constructor(
    private readonly classRepo: IClassRepository = new ClassRepository(),
    private readonly studentRepo: IStudentRepository = new StudentRepository(),
    private readonly teacherRepo: ITeacherRepository = new TeacherRepository()
  ) {}

  async execute(id: number) {
    const c = await this.classRepo.findById(id);
    if (!c) {
      throw new ApiError(404, 'not_found', 'Class not found');
    }
    const studentIds = await this.classRepo.listStudents(id);
    const teacherIds = await this.classRepo.listTeachers(id);
    const students = await Promise.all(
      studentIds.map(async (sid) => {
        const s = await this.studentRepo.findById(sid);
        return s ? s.props : null;
      })
    );
    const teachers = await Promise.all(
      teacherIds.map(async (tid) => {
        const t = await this.teacherRepo.findById(tid);
        return t ? t.props : null;
      })
    );
    return {
      ...c.props,
      students: students.filter((s) => s !== null),
      teachers: teachers.filter((t) => t !== null),
    };
  }
}
