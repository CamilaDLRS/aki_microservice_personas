import { ITeacherRepository } from '../../../shared/domain/repositories/ITeacherRepository';
import { ApiError } from '../../../shared/errors/ApiError';
import { sendPasswordEmail } from '../../../shared/utils/sendPasswordEmail';
import { CreateTeacherInput } from './CreateTeacherModels';

export async function createTeacher(repo: ITeacherRepository, input: CreateTeacherInput) {
  if (input.cpf.length !== 11) {
    throw new ApiError(400, 'validation_error', 'CPF must be 11 digits');
  }
  try {
    const teacher = await repo.create(input);
    if (!input.password_hash) {
      // Generate token and expiration (placeholder, replace with real logic)
      const token = 'GENERATED_TOKEN';
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      if (typeof teacher.props.id !== 'number') {
        throw new ApiError(500, 'internal_error', 'Teacher ID is missing after creation');
      }
      await sendPasswordEmail({
        teacher_id: teacher.props.id,
        teacher_email: teacher.props.email,
        teacher_name: teacher.props.full_name,
        token,
        expires_at: expiresAt,
        emailType: 'setup',
      });
    }
    return teacher;
  } catch (err: unknown) {
    if (err instanceof Error && 'name' in err && err.name === 'SequelizeUniqueConstraintError') {
      throw new ApiError(409, 'conflict', 'CPF or email already exists');
    }
    throw err;
  }
}
