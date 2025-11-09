import { Request, Response, NextFunction } from 'express';
import {
  ClassRepository,
  ClassTeacherModel,
} from '../../../shared/Infrastructure/repositories/ClassRepository';
import { TeacherRepository } from '../../../shared/Infrastructure/repositories/TeacherRepository';
import { listClasses } from './ListClassesHandler';

const classRepo = new ClassRepository();
const teacherRepo = new TeacherRepository();

export class ListClassesController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const size = Number(req.query.size) || 50;
      const teacherEmail = req.query.teacher_email as string | undefined;

      if (teacherEmail) {
        const teacher = await teacherRepo.findByEmail(teacherEmail);
        if (!teacher) {
          return res.status(404).json({
            code: 'teacher_not_found',
            message: 'No teacher found with that email',
          });
        }

        const classTeacherRows = await ClassTeacherModel.findAll({
          where: { teacher_id: teacher.props.id },
          attributes: ['class_id'],
          raw: true,
        });
        const classIds = classTeacherRows.map((row: { class_id: number }) => row.class_id);

        if (classIds.length === 0) {
          return res.json({
            data: [],
            meta: { page, size, total: 0 },
            message: 'No classes found for this teacher',
          });
        }

        const offset = (page - 1) * size;
        const pagedIds = classIds.slice(offset, offset + size);
        const classes = await Promise.all(
          pagedIds.map(async (id: number) => {
            const c = await classRepo.findById(id);
            return c ? c.props : null;
          })
        );

        return res.json({
          data: classes.filter((c) => c !== null),
          meta: { page, size, total: classIds.length },
          message: 'Classes retrieved',
        });
      } else {
        const result = await listClasses(classRepo, { page, size });
        res.json({
          data: result.items.map((i) => i.props),
          meta: result.meta,
          message: 'Classes retrieved',
        });
      }
    } catch (e) {
      next(e);
    }
  }
}
