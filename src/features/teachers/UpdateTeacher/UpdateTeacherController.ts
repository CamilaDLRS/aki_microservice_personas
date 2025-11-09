import { Request, Response, NextFunction } from 'express';
import { TeacherRepository } from '../../../shared/Infrastructure/repositories/TeacherRepository';
import { updateTeacher } from './UpdateTeacherHandler';
import { UpdateTeacherInput } from './UpdateTeacherModels';

const teacherRepo = new TeacherRepository();

export class UpdateTeacherController {
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const teacher = await updateTeacher(teacherRepo, {
        id,
        ...req.body,
      } as UpdateTeacherInput & { id: number });
      if (!teacher) {
        return res.status(404).json({ message: 'Teacher not found' });
      }
      res.json({
        data: teacher.props,
        meta: null,
        message: 'Teacher updated',
      });
    } catch (e) {
      next(e);
    }
  }
}
