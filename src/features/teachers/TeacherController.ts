import { Request, Response, NextFunction } from 'express';
import { TeacherRepository } from '../../shared/Infrastructure/repositories/TeacherRepository';
import { createTeacher } from './CreateTeacher/CreateTeacherHandler';
import { listTeachers } from './ListTeachers/ListTeachersHandler';
import { getTeacherById } from './GetTeacherById/GetTeacherByIdHandler';
import { updateTeacher } from './UpdateTeacher/UpdateTeacherHandler';
import { deleteTeacher } from './DeleteTeacher/DeleteTeacherHandler';
import { recoverPassword } from './RecoverPassword/RecoverPasswordHandler';

const repo = new TeacherRepository();

export class TeacherController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const teacher = await repo.findByEmail(email);
      if (!teacher || !teacher.props.password_hash) {
        return res
          .status(401)
          .json({ code: 'invalid_credentials', message: 'Invalid email or password' });
      }
      // Simple hash check (replace with bcrypt in production)
      if (teacher.props.password_hash !== password) {
        return res
          .status(401)
          .json({ code: 'invalid_credentials', message: 'Invalid email or password' });
      }
      res.json({
        data: {
          id: teacher.props.id,
          full_name: teacher.props.full_name,
          email: teacher.props.email,
        },
        message: 'Login successful',
      });
    } catch (e) {
      next(e);
    }
  }
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const size = Number(req.query.size) || 50;
      const result = await listTeachers(repo, {
        page,
        size,
      });
      res.json({
        data: result.items.map((i) => i.props),
        meta: result.meta,
        message: 'Teachers retrieved',
      });
    } catch (e) {
      next(e);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const t = await createTeacher(repo, req.body);
      res.status(201).json({
        data: t.props,
        meta: null,
        message: 'Teacher created',
      });
    } catch (e) {
      next(e);
    }
  }

  async recoverPassword(req: Request, res: Response, next: NextFunction) {
    try {
      await recoverPassword(repo, { email: req.body.teacher_email });
      res.status(200).json({ message: 'Password recovery email sent' });
    } catch (e) {
      next(e);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.teacherId || req.params.id);
      const t = await getTeacherById(repo, { id });
      if (!t) {
        return res.status(404).json({ message: 'Teacher not found' });
      }
      res.json({
        data: t.props,
        meta: null,
        message: 'Teacher found',
      });
    } catch (e) {
      next(e);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.teacherId || req.params.id);
      const t = await updateTeacher(repo, { id, ...req.body });
      if (!t) {
        return res.status(404).json({ message: 'Teacher not found' });
      }
      res.json({
        data: t.props,
        meta: null,
        message: 'Teacher updated',
      });
    } catch (e) {
      next(e);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.teacherId || req.params.id);
      await deleteTeacher(repo, { id });
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  }
}
