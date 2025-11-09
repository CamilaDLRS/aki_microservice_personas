import { ITeacherRepository } from '../../../shared/domain/repositories/ITeacherRepository';
import { ApiError } from '../../../shared/errors/ApiError';
import { sendPasswordEmail } from '../../../shared/utils/sendPasswordEmail';
import { RecoverPasswordInput } from './RecoverPasswordModels';

export async function recoverPassword(repo: ITeacherRepository, input: RecoverPasswordInput) {
  const teacher = await repo.findByEmail(input.email);
  if (!teacher) {
    throw new ApiError(404, 'not_found', 'Teacher not found');
  }
  // Generate token and expiration (placeholder, replace with real logic)
  const token = 'GENERATED_TOKEN';
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  if (typeof teacher.props.id !== 'number') {
    throw new ApiError(500, 'internal_error', 'Teacher ID is missing');
  }
  await sendPasswordEmail({
    teacher_id: teacher.props.id,
    teacher_email: teacher.props.email,
    teacher_name: teacher.props.full_name,
    token,
    expires_at: expiresAt,
    emailType: 'recovery',
  });
}
