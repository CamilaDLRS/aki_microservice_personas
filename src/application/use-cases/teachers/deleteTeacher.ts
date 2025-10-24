import { ITeacherRepository } from '../../../domain/repositories/ITeacherRepository';
import { ApiError } from '../../../shared/errors/ApiError';
export async function deleteTeacher(repo: ITeacherRepository, id: number) { const ok = await repo.delete(id); if (!ok) throw new ApiError(404,'not_found','Teacher not found'); return ok; }
