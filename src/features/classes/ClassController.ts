import { Request, Response, NextFunction } from 'express';
import {
  ClassRepository,
  ClassTeacherModel,
} from '../../shared/Infrastructure/repositories/ClassRepository';
import { createClass } from './createClass/CreateClassHandler';
import { listClasses } from './listClasses/ListClassesHandler';
import { getClassById } from './getClassById/GetClassByIdHandler';
import { updateClass } from './updateClass/UpdateClassHandler';
import { deleteClass } from './deleteClass/DeleteClassHandler';
import { addStudentToClass } from './addStudentToClass/AddStudentToClassHandler';
import { removeStudentFromClass } from './removeStudentFromClass/RemoveStudentFromClassHandler';
import { addTeacherToClass } from './addTeacherToClass/AddTeacherToClassHandler';
import { StudentRepository } from '../../shared/Infrastructure/repositories/StudentRepository';
import { TeacherRepository } from '../../shared/Infrastructure/repositories/TeacherRepository';
import { removeTeacherFromClass } from './removeTeacherFromClass/RemoveTeacherFromClassHandler';

const classRepo = new ClassRepository();

export class ClassController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const size = Number(req.query.size) || 50;
      const teacherEmail = req.query.teacher_email as string | undefined;
      if (teacherEmail) {
        // Find teacher by email
        const teacherRepo = new TeacherRepository();
        const teacher = await teacherRepo.findByEmail(teacherEmail);
        if (!teacher) {
          return res.status(404).json({
            code: 'teacher_not_found',
            message: 'No teacher found with that email',
            data: null,
            meta: null,
          });
        }
        // Find all classes taught by this teacher
        // Get all class IDs for this teacher
        const classTeacherRows = await ClassTeacherModel.findAll({
          where: { teacher_id: teacher.props.id },
          attributes: ['class_id'],
          raw: true,
        });
        const classIds = classTeacherRows.map((row) => row.class_id);
        if (classIds.length === 0) {
          return res.json({
            data: [],
            meta: { page, size, total: 0 },
            message: 'No classes found for this teacher',
          });
        }
        // Paginate classes
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
        const result = await listClasses(classRepo, {
          page,
          size,
        });
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

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const c = await createClass(classRepo, req.body);
      res.status(201).json({
        data: c.props,
        meta: null,
        message: 'Class created',
      });
    } catch (e) {
      next(e);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.classId || req.params.id);
      const c = await getClassById(classRepo, id);
      // Hydrate members
      const studentIds = await classRepo.listStudents(id);
      const teacherIds = await classRepo.listTeachers(id);
      const studentRepo = new StudentRepository();
      const teacherRepo = new TeacherRepository();
      const students = await Promise.all(
        studentIds.map(async (sid) => {
          const s = await studentRepo.findById(sid);
          return s ? s.props : null;
        })
      );
      const teachers = await Promise.all(
        teacherIds.map(async (tid) => {
          const t = await teacherRepo.findById(tid);
          return t ? t.props : null;
        })
      );
      const payload = {
        ...c.props,
        students: students.filter((s) => s !== null),
        teachers: teachers.filter((t) => t !== null),
      };
      res.json({
        data: payload,
        meta: null,
        message: 'Class found',
      });
    } catch (e) {
      next(e);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.classId || req.params.id);
      const c = await updateClass(classRepo, id, req.body);
      res.json({
        data: c.props,
        meta: null,
        message: 'Class updated',
      });
    } catch (e) {
      next(e);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.classId || req.params.id);
      await deleteClass(classRepo, id);
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  }

  async listStudents(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.classId);
      const studentIds = await classRepo.listStudents(id);
      const studentRepo = new StudentRepository();
      const students = await Promise.all(
        studentIds.map(async (sid) => {
          const s = await studentRepo.findById(sid);
          return s ? s.props : null;
        })
      );
      res.json({
        data: students.filter((s) => s !== null),
        meta: null,
        message: 'Class students',
      });
    } catch (e) {
      next(e);
    }
  }

  async addStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.classId);
      const studentRepo = new StudentRepository();
      await addStudentToClass(classRepo, studentRepo, id, req.body.student_id);
      const c = await classRepo.findById(id);
      res.status(201).json({
        data: c?.props || null,
        meta: null,
        message: 'Student added',
      });
    } catch (e) {
      next(e);
    }
  }

  async removeStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.classId);
      const studentId = Number(req.params.studentId || req.body.student_id);
      await removeStudentFromClass(classRepo, id, studentId);
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  }

  async listTeachers(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.classId);
      const teacherIds = await classRepo.listTeachers(id);
      const teacherRepo = new TeacherRepository();
      const teachers = await Promise.all(
        teacherIds.map(async (tid) => {
          const t = await teacherRepo.findById(tid);
          return t ? t.props : null;
        })
      );
      res.json({
        data: teachers.filter((t) => t !== null),
        meta: null,
        message: 'Class teachers',
      });
    } catch (e) {
      next(e);
    }
  }

  async addTeacher(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.classId);
      const teacherRepo = new TeacherRepository();
      await addTeacherToClass(classRepo, teacherRepo, id, req.body.teacher_id);
      const c = await classRepo.findById(id);
      res.status(201).json({
        data: c?.props || null,
        meta: null,
        message: 'Teacher added',
      });
    } catch (e) {
      next(e);
    }
  }

  async removeTeacher(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.classId);
      const teacherId = Number(req.params.teacherId || req.body.teacher_id);
      await removeTeacherFromClass(classRepo, id, teacherId);
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  }
}
