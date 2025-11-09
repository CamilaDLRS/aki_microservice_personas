import { Request, Response, NextFunction } from 'express';
import { TeacherRepository } from '../../../shared/Infrastructure/repositories/TeacherRepository';
import { listTeachers } from './ListTeachersHandler';

const teacherRepo = new TeacherRepository();

export class ListTeachersController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, size = 50 } = req.query;
      const result = await listTeachers(teacherRepo, { page: Number(page), size: Number(size) });
      res.json({
        data: result.items.map((i) => i.props),
        meta: result.meta,
        message: 'Teachers retrieved',
      });
    } catch (e) {
      next(e);
    }
  }
}
