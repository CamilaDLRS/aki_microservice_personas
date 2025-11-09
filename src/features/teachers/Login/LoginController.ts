import { Request, Response, NextFunction } from 'express';
import { TeacherRepository } from '../../../shared/Infrastructure/repositories/TeacherRepository';
import { login } from './LoginHandler';

const teacherRepo = new TeacherRepository();

export class LoginController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await login(teacherRepo, { email, password });
      res.json(result);
    } catch (e) {
      next(e);
    }
  }
}
