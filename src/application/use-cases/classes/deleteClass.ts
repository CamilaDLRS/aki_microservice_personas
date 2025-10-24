import { IClassRepository } from '../../../domain/repositories/IClassRepository';
import { ApiError } from '../../../shared/errors/ApiError';
export async function deleteClass(repo: IClassRepository, id: number) { const ok = await repo.delete(id); if (!ok) throw new ApiError(404,'not_found','Class not found'); return ok; }
