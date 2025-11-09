import { Request, Response, NextFunction } from 'express';
import { StudentRepository } from '../../../shared/Infrastructure/repositories/StudentRepository';
import { listStudents } from './ListStudentsHandler';

const studentRepo = new StudentRepository();

export class ListStudentsController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, size = 50 } = req.query;
      const result = await listStudents(studentRepo, { page: Number(page), size: Number(size) });
      res.json({
        data: result.items.map((i) => i.props),
        meta: result.meta,
        message: 'Students retrieved',
      });
    } catch (e) {
      next(e);
    }
  }
}
