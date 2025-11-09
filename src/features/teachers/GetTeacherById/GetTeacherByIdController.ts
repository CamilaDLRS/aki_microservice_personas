import { Request, Response, NextFunction } from 'express';
import { TeacherRepository } from '../../../shared/Infrastructure/repositories/TeacherRepository';
import { getTeacherById } from './GetTeacherByIdHandler';

const teacherRepo = new TeacherRepository();

export class GetTeacherByIdController {
  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const teacher = await getTeacherById(teacherRepo, { id });
      if (!teacher) {
        return res.status(404).json({ message: 'Teacher not found' });
      }
      res.json({
        data: teacher.props,
        meta: null,
        message: 'Teacher found',
      });
    } catch (e) {
      next(e);
    }
  }
}
