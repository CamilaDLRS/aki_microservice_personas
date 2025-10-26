import { ITeacherRepository } from '../../../domain/repositories/ITeacherRepository';
import { ApiError } from '../../../shared/errors/ApiError';
import { sendPasswordEmail } from '../../../shared/utils/sendPasswordEmail';

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
      // Generate token and expiration (placeholder, replace with real logic)
      const token = 'GENERATED_TOKEN';
      const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      if (typeof teacher.props.id !== 'number') {
        throw new ApiError(500, 'internal_error', 'Teacher ID is missing after creation');
      }
      await sendPasswordEmail({
        teacher_id: teacher.props.id,
        teacher_email: teacher.props.email,
        teacher_name: teacher.props.full_name,
        token,
        expires_at,
        emailType: 'setup',
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
