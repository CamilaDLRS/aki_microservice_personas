import { ITeacherRepository } from '../../../domain/repositories/ITeacherRepository';
import { ApiError } from '../../../shared/errors/ApiError';
import { emitInternalEvent } from '../../../shared/utils/internalEvents';

interface Input {
  cpf: string;
  full_name: string;
  email: string;
  password_hash?: string | null;
}

export async function createTeacher(repo: ITeacherRepository, input: Input) {
  if (input.cpf.length !== 11) {
    throw new ApiError(400, 'validation_error', 'CPF must be 11 digits');
  }
  try {
    const teacher = await repo.create(input);
    if (!input.password_hash) {
      emitInternalEvent('teacher.password.setup', {
        teacher_id: teacher.props.id,
        email: teacher.props.email
      });
    }
    return teacher;
  } catch (err: any) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      throw new ApiError(409, 'conflict', 'CPF or email already exists');
    }
    throw err;
  }
}