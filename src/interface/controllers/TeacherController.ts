import { sendPasswordEmail } from '../../shared/utils/sendPasswordEmail';
import { recoverPassword } from '../../application/use-cases/teachers/recoverPassword';
import { Request, Response, NextFunction } from 'express';
import { TeacherRepository } from '../../infrastructure/repositories/TeacherRepository';
import { createTeacher } from '../../application/use-cases/teachers/createTeacher';
import { listTeachers } from '../../application/use-cases/teachers/listTeachers';
import { getTeacherById } from '../../application/use-cases/teachers/getTeacherById';
import { updateTeacher } from '../../application/use-cases/teachers/updateTeacher';
import { deleteTeacher } from '../../application/use-cases/teachers/deleteTeacher';

const repo = new TeacherRepository();

export class TeacherController {
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
      // Always send setup email if password_hash is missing
      if (!req.body.password_hash) {
        const token = 'SETUP_TOKEN';
        const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
        await sendPasswordEmail({
          teacher_id: t.props.id!,
          teacher_email: t.props.email,
          teacher_name: t.props.full_name,
          token,
          expires_at,
        });
      }
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
      const result = await recoverPassword(repo, req.body.teacher_email);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.teacherId || req.params.id);
      const t = await getTeacherById(repo, id);
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
      const t = await updateTeacher(repo, id, req.body);
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
      await deleteTeacher(repo, id);
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  }
}
