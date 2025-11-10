import { Request, Response, NextFunction } from 'express';
import { RecoverPasswordHandler } from './RecoverPasswordHandler';

export class RecoverPasswordController {
  async recover(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const handler = new RecoverPasswordHandler();
      await handler.execute({ email });
      res.status(200).json({ message: 'Password recovery email sent' });
    } catch (e) {
      next(e);
    }
  }
}
