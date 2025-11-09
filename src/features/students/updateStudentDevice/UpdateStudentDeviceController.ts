import { Request, Response, NextFunction } from 'express';
import { StudentRepository } from '../../../shared/Infrastructure/repositories/StudentRepository';
import { updateStudentDevice } from './UpdateStudentDeviceHandler';
import { UpdateStudentDeviceInput } from './UpdateStudentDeviceModels';

const studentRepo = new StudentRepository();

export class UpdateStudentDeviceController {
  async updateDevice(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const { deviceId } = req.body as UpdateStudentDeviceInput;
      const student = await updateStudentDevice(studentRepo, id, deviceId);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
      res.json({
        data: student.props,
        meta: null,
        message: 'Student device updated',
      });
    } catch (e) {
      next(e);
    }
  }
}
