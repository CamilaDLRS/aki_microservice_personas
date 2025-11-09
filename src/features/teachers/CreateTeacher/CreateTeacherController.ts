import { Request, Response, NextFunction } from 'express';
import { TeacherRepository } from '../../../shared/Infrastructure/repositories/TeacherRepository';
import { createTeacher } from './CreateTeacherHandler';
import { CreateTeacherInput } from './CreateTeacherModels';

const teacherRepo = new TeacherRepository();

export class CreateTeacherController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const teacher = await createTeacher(teacherRepo, req.body as CreateTeacherInput);
      res.status(201).json({
        data: teacher.props,
        meta: null,
        message: 'Teacher created',
      });
    } catch (e) {
      next(e);
    }
  }
}
