import { Request, Response, NextFunction } from 'express';
import { ClassRepository } from '../../infrastructure/repositories/ClassRepository';
import { createClass } from '../../application/use-cases/classes/createClass';
import { listClasses } from '../../application/use-cases/classes/listClasses';
import { getClassById } from '../../application/use-cases/classes/getClassById';
import { updateClass } from '../../application/use-cases/classes/updateClass';
import { deleteClass } from '../../application/use-cases/classes/deleteClass';
import { addStudentToClass } from '../../application/use-cases/classes/addStudentToClass';
import { removeStudentFromClass } from '../../application/use-cases/classes/removeStudentFromClass';
import { addTeacherToClass } from '../../application/use-cases/classes/addTeacherToClass';
import { StudentRepository } from '../../infrastructure/repositories/StudentRepository';
import { TeacherRepository } from '../../infrastructure/repositories/TeacherRepository';
import { removeTeacherFromClass } from '../../application/use-cases/classes/removeTeacherFromClass';

const repo = new ClassRepository();

export class ClassController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const size = Number(req.query.size) || 50;
      const result = await listClasses(repo, {
        page,
        size,
      });
      res.json({
        data: result.items.map((i) => i.props),
        meta: result.meta,
        message: 'Classes retrieved',
      });
    } catch (e) {
      next(e);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const c = await createClass(repo, req.body);
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
      const c = await getClassById(repo, id);
      // Hydrate members
      const studentIds = await repo.listStudents(id);
      const teacherIds = await repo.listTeachers(id);
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
      const c = await updateClass(repo, id, req.body);
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
      await deleteClass(repo, id);
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  }

  async listStudents(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.classId);
      const studentIds = await repo.listStudents(id);
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
      await addStudentToClass(repo, studentRepo, id, req.body.student_id);
      const c = await repo.findById(id);
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
      await removeStudentFromClass(repo, id, studentId);
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  }

  async listTeachers(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.classId);
      const teacherIds = await repo.listTeachers(id);
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
      await addTeacherToClass(repo, teacherRepo, id, req.body.teacher_id);
      const c = await repo.findById(id);
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
      await removeTeacherFromClass(repo, id, teacherId);
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  }
}
