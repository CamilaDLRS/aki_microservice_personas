import { Request, Response, NextFunction } from 'express';
import { TeacherRepository } from '../../../shared/Infrastructure/repositories/TeacherRepository';
import { recoverPassword } from './RecoverPasswordHandler';

const teacherRepo = new TeacherRepository();

export class RecoverPasswordController {
  async recover(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      await recoverPassword(teacherRepo, email);
      res.status(200).json({ message: 'Password recovery email sent' });
    } catch (e) {
      next(e);
    }
  }
}
