import { ApiError } from '../../../shared/errors/ApiError';
import { StudentRepository } from '../../../shared/Infrastructure/repositories/StudentRepository';
import { IStudentRepository } from '../../../shared/domain/repositories/IStudentRepository';

export class UpdateStudentDeviceHandler {
  constructor(private readonly repo: IStudentRepository = new StudentRepository()) {}

  async execute(id: number, deviceId: string) {
    if (!deviceId || deviceId.length < 3) {
      throw new ApiError(400, 'validation_error', 'device_id too short');
    }
    const updated = await this.repo.update(id, { device_id: deviceId });
    if (!updated) {
      throw new ApiError(404, 'not_found', 'Student not found');
    }
    return updated;
  }
}
