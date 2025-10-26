import { ITeacherRepository } from '../../../domain/repositories/ITeacherRepository';
import { ApiError } from '../../../shared/errors/ApiError';
import { sendPasswordEmail } from '../../../shared/utils/sendPasswordEmail';

export async function recoverPassword(repo: ITeacherRepository, teacher_email: string) {
  const teacher = await repo.findByEmail(teacher_email);
  if (!teacher) {
    throw new ApiError(404, 'not_found', 'Teacher not found');
  }
  // Generate token and expiration (replace with real logic)
  const token = 'RECOVERY_TOKEN';
  const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  await sendPasswordEmail({
    teacher_id: teacher.props.id!,
    teacher_email: teacher.props.email,
    teacher_name: teacher.props.full_name,
    token,
    expires_at,
    emailType: 'recovery',
  });
  return {
    status: 'recovery_email_sent',
    teacher_email: teacher.props.email,
    sent_at: new Date().toISOString(),
  };
}
