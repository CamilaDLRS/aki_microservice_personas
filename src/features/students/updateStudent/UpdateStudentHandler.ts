import { ApiError } from '../../../shared/errors/ApiError';
import { UpdateStudentInput } from './UpdateStudentModels';
import { StudentRepository } from '../../../shared/Infrastructure/repositories/StudentRepository';
import { IStudentRepository } from '../../../shared/domain/repositories/IStudentRepository';

export class UpdateStudentHandler {
  constructor(private readonly repo: IStudentRepository = new StudentRepository()) {}

  async execute(id: number, input: UpdateStudentInput) {
    if (input.device_id) {
      const deviceOwner = await this.repo.findByDeviceId(input.device_id);
      if (deviceOwner && deviceOwner.props.id !== id) {
        throw new ApiError(409, 'conflict', 'device_id already assigned to another student');
      }
    }
    const updated = await this.repo.update(id, input);
    if (!updated) {
      throw new ApiError(404, 'not_found', 'Student not found');
    }
    return updated;
  }
}
