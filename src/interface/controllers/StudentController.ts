import { Request, Response, NextFunction } from 'express';
import { StudentRepository } from '../../infrastructure/repositories/StudentRepository';
import { createStudent } from '../../application/use-cases/students/createStudent';
import { listStudents } from '../../application/use-cases/students/listStudents';
import { getStudentById } from '../../application/use-cases/students/getStudentById';
import { updateStudent } from '../../application/use-cases/students/updateStudent';
import { deleteStudent } from '../../application/use-cases/students/deleteStudent';
import { ok } from '../../shared/utils/response';
import { updateStudentDevice } from '../../application/use-cases/students/updateStudentDevice';

const repo = new StudentRepository();

export class StudentController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const size = Number(req.query.size) || 50;
      const q = req.query.q as string | undefined;
      const result = await listStudents(repo, {
        page,
        size,
        q
      });
      res.json(ok(result.items.map(i => i.props), 'Students retrieved', result.meta));
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const student = await createStudent(repo, req.body);
      res.status(201).json(ok(student.props, 'Student created'));
    } catch (err) {
      next(err);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.studentId || req.params.id);
      const student = await getStudentById(repo, id);
      res.json(ok(student.props, 'Student found'));
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.studentId || req.params.id);
      const student = await updateStudent(repo, id, req.body);
      res.json(ok(student.props, 'Student updated'));
    } catch (err) {
      next(err);
    }
  }

  async updateDevice(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.studentId);
      const { device_id } = req.body;
      const student = await updateStudentDevice(repo, id, device_id);
      res.json(ok(student.props, 'Device associated'));
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.studentId || req.params.id);
      await deleteStudent(repo, id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}
