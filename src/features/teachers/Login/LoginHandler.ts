import { ITeacherRepository } from '../../../shared/domain/repositories/ITeacherRepository';
import { Teacher } from '../../../shared/domain/entities/Teacher';
import { ApiError } from '../../../shared/errors/ApiError';

export const login = async (
  teacherRepo: ITeacherRepository,
  { email, password }: { email: string; password: string }
): Promise<Teacher> => {
  const teacher = await teacherRepo.findByEmail(email);

  if (!teacher) {
    throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid credentials');
  }

  const isPasswordValid = await teacher.validatePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid credentials');
  }

  return teacher;
};

