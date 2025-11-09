import { Request, Response, NextFunction } from 'express';
import { StudentRepository } from '../../../shared/Infrastructure/repositories/StudentRepository';
import { updateStudent } from './UpdateStudentHandler';
import { UpdateStudentInput } from './UpdateStudentModels';

const studentRepo = new StudentRepository();

export class UpdateStudentController {
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const student = await updateStudent(studentRepo, id, req.body as UpdateStudentInput);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
      res.json({
        data: student.props,
        meta: null,
        message: 'Student updated',
      });
    } catch (e) {
      next(e);
    }
  }
}
