import { Request, Response, NextFunction } from 'express';
import { StudentRepository } from '../../shared/Infrastructure/repositories/StudentRepository';
import { createStudent } from './createStudent/CreateStudentHandler';
import { listStudents } from './listStudents/ListStudentsHandler';
import { getStudentById } from './getStudentById/GetStudentByIdHandler';
import { updateStudent } from './updateStudent/UpdateStudentHandler';
import { deleteStudent } from './deleteStudent/DeleteStudentHandler';
import { ok } from '../../shared/utils/response';
import { updateStudentDevice } from './updateStudentDevice/UpdateStudentDeviceHandler';
import { getStudentByCpf } from './getStudentByCpf/GetStudentByCpfHandler';

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
        q,
      });
      res.json(
        ok(
          result.items.map((i) => i.props),
          'Students retrieved',
          result.meta
        )
      );
    } catch (err) {
      next(err);
    }
  }
  async getByCpf(req: Request, res: Response, next: NextFunction) {
    try {
      const cpf = req.params.cpf;
      if (!cpf || cpf.length !== 11) {
        return res.status(400).json({
          code: 'validation_error',
          message: 'cpf is required and must be 11 digits',
          details: [],
        });
      }
      const student = await getStudentByCpf(repo, cpf);
      res.json(ok(student.props, 'Student found'));
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
      const id = (req.params.studentId || req.params.id) as string;
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

  async getByDevice(req: Request, res: Response, next: NextFunction) {
    try {
      const deviceId = req.query.device_id as string;
      if (!deviceId) {
        return res.status(400).json({
          code: 'validation_error',
          message: 'device_id is required',
          details: [],
        });
      }
      const student = await repo.findByDeviceId(deviceId);
      if (!student) {
        return res.status(404).json({
          code: 'not_found',
          message: 'Student not found',
          details: [],
        });
      }
      res.json(ok(student.props, 'Student found'));
    } catch (err) {
      next(err);
    }
  }

  async updateDevice(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.studentId);
      const { device_id: deviceId } = req.body;
      const student = await updateStudentDevice(repo, id, deviceId);
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
