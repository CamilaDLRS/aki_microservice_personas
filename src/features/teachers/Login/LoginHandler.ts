import { Teacher } from '../../../shared/domain/entities/Teacher';
import { ApiError } from '../../../shared/errors/ApiError';
import { TeacherRepository } from '../../../shared/Infrastructure/repositories/TeacherRepository';

const repo = new TeacherRepository();

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<Teacher> => {
  const teacher = await repo.findByEmail(email);

  if (!teacher) {
    throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid credentials');
  }

  const isPasswordValid = await teacher.validatePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid credentials');
  }

  return teacher;
};
