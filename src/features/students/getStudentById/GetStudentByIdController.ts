import { Request, Response, NextFunction } from 'express';
import { StudentRepository } from '../../../shared/Infrastructure/repositories/StudentRepository';
import { getStudentById } from './GetStudentByIdHandler';

const studentRepo = new StudentRepository();

export class GetStudentByIdController {
  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const student = await getStudentById(studentRepo, id);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
      res.json({
        data: student.props,
        meta: null,
        message: 'Student found',
      });
    } catch (e) {
      next(e);
    }
  }
}
