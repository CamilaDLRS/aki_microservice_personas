import { Request, Response, NextFunction } from 'express';
import { UpdateStudentHandler } from './UpdateStudentHandler';
import { UpdateStudentInput } from './UpdateStudentModels';

export class UpdateStudentController {
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const handler = new UpdateStudentHandler();
      const student = await handler.execute(id, req.body as UpdateStudentInput);
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
