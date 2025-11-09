import { Request, Response, NextFunction } from 'express';
import { StudentRepository } from '../../../shared/Infrastructure/repositories/StudentRepository';
import { deleteStudent } from './DeleteStudentHandler';

const studentRepo = new StudentRepository();

export class DeleteStudentController {
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      await deleteStudent(studentRepo, id);
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  }
}
