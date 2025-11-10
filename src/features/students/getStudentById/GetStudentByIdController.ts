import { Request, Response, NextFunction } from 'express';
import { GetStudentByIdHandler } from './GetStudentByIdHandler';

export class GetStudentByIdController {
  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const handler = new GetStudentByIdHandler();
      const student = await handler.execute(id);
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
