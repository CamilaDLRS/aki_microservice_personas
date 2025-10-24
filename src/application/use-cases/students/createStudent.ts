import { IStudentRepository } from '../../../domain/repositories/IStudentRepository';
import { ApiError } from '../../../shared/errors/ApiError';

interface Input { cpf: string; full_name: string; device_id?: string | null; }
export async function createStudent(repo: IStudentRepository, input: Input) {
  // Basic validation delegated to Zod at controller, but double-check business constraints here
  // Example: ensure CPF length
  if (input.cpf.length !== 11) {
    throw new ApiError(400, 'validation_error', 'CPF must be 11 digits');
  }
  const existing = await repo.findByCpf(input.cpf);
  if (existing) {
    throw new ApiError(409, 'conflict', 'CPF already exists');
  }
  const student = await repo.create({ cpf: input.cpf, full_name: input.full_name, device_id: input.device_id });
  return student;
}
