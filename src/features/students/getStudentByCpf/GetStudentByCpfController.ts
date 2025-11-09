import { Request, Response, NextFunction } from 'express';
import { StudentRepository } from '../../../shared/Infrastructure/repositories/StudentRepository';
import { getStudentByCpf } from './GetStudentByCpfHandler';

const studentRepo = new StudentRepository();

export class GetStudentByCpfController {
  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const cpf = req.params.cpf;
      const student = await getStudentByCpf(studentRepo, cpf);
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
