import { Request, Response, NextFunction } from 'express';
import { StudentRepository } from '../../../shared/Infrastructure/repositories/StudentRepository';
import { createStudent } from './CreateStudentHandler';
import { CreateStudentInput } from './CreateStudentModels';

const studentRepo = new StudentRepository();

export class CreateStudentController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const student = await createStudent(studentRepo, req.body as CreateStudentInput);
      res.status(201).json({
        data: student.props,
        meta: null,
        message: 'Student created',
      });
    } catch (e) {
      next(e);
    }
  }
}
