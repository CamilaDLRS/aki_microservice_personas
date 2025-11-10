import { Request, Response, NextFunction } from 'express';
import { GetStudentByCpfHandler } from './GetStudentByCpfHandler';

export class GetStudentByCpfController {
  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const cpf = req.params.cpf;
      const handler = new GetStudentByCpfHandler();
      const student = await handler.execute(cpf);
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
