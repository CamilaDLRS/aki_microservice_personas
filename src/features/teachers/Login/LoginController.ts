import { Request, Response, NextFunction } from 'express';
import { login } from './LoginHandler';

export class LoginController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await login({ email, password });
      res.json(result);
    } catch (e) {
      next(e);
    }
  }
}
