import { Request, Response, NextFunction } from 'express';
import { ClassRepository } from '../../../shared/Infrastructure/repositories/ClassRepository';
import { StudentRepository } from '../../../shared/Infrastructure/repositories/StudentRepository';
import { TeacherRepository } from '../../../shared/Infrastructure/repositories/TeacherRepository';
import { getClassById } from './GetClassByIdHandler';

const classRepo = new ClassRepository();
const studentRepo = new StudentRepository();
const teacherRepo = new TeacherRepository();

export class GetClassByIdController {
  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.classId || req.params.id);
      const c = await getClassById(classRepo, id);

      if (!c) {
        return res.status(404).json({ message: 'Class not found' });
      }

      const studentIds = await classRepo.listStudents(id);
      const teacherIds = await classRepo.listTeachers(id);

      const students = await Promise.all(
        studentIds.map(async (sid) => {
          const s = await studentRepo.findById(sid);
          return s ? s.props : null;
        })
      );
      const teachers = await Promise.all(
        teacherIds.map(async (tid) => {
          const t = await teacherRepo.findById(tid);
          return t ? t.props : null;
        })
      );

      const payload = {
        ...c.props,
        students: students.filter((s) => s !== null),
        teachers: teachers.filter((t) => t !== null),
      };

      res.json({
        data: payload,
        meta: null,
        message: 'Class found',
      });
    } catch (e) {
      next(e);
    }
  }
}
