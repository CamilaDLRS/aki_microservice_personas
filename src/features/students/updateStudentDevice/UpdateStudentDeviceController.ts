import { Request, Response, NextFunction } from 'express';
import { UpdateStudentDeviceHandler } from './UpdateStudentDeviceHandler';
import { UpdateStudentDeviceInput } from './UpdateStudentDeviceModels';

export class UpdateStudentDeviceController {
  async updateDevice(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const { deviceId } = req.body as UpdateStudentDeviceInput;
      const handler = new UpdateStudentDeviceHandler();
      const student = await handler.execute(id, deviceId);
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
