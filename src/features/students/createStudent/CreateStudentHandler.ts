import { IStudentRepository } from '../../../shared/domain/repositories/IStudentRepository';
import { StudentRepository } from '../../../shared/Infrastructure/repositories/StudentRepository';
import { ApiError } from '../../../shared/errors/ApiError';
import { CreateStudentInput } from './CreateStudentModels';

export class CreateStudentHandler {
  constructor(private readonly repo: IStudentRepository = new StudentRepository()) {}
  async execute(input: CreateStudentInput) {
    // Basic validation delegated to Zod at controller, but double-check business constraints here
    // Example: ensure CPF length
    if (input.cpf.length !== 11) {
      throw new ApiError(400, 'validation_error', 'CPF must be 11 digits');
    }
    const existing = await this.repo.findByCpf(input.cpf);
    if (existing) {
      throw new ApiError(409, 'conflict', 'CPF already exists');
    }
    if (input.device_id) {
      const deviceOwner = await this.repo.findByDeviceId(input.device_id);
      if (deviceOwner) {
        throw new ApiError(409, 'conflict', 'device_id already assigned to another student');
      }
    }
    const student = await this.repo.create({
      cpf: input.cpf,
      full_name: input.full_name,
      device_id: input.device_id,
    });
    return student;
  }
}
