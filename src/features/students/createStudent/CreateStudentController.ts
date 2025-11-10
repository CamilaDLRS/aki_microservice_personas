import { Request, Response, NextFunction } from 'express';
import { CreateStudentHandler } from './CreateStudentHandler';
import { CreateStudentInput } from './CreateStudentModels';

export class CreateStudentController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const handler = new CreateStudentHandler();
      const student = await handler.execute(req.body as CreateStudentInput);
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
