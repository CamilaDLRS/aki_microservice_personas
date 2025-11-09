import { Request, Response, NextFunction } from 'express';
import { ClassRepository } from '../../../shared/Infrastructure/repositories/ClassRepository';
import { StudentRepository } from '../../../shared/Infrastructure/repositories/StudentRepository';
import { addStudentToClass } from './AddStudentToClassHandler';

const classRepo = new ClassRepository();
const studentRepo = new StudentRepository();

export class AddStudentToClassController {
  async addStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.classId);
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
}
