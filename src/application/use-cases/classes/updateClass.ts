import { IClassRepository } from '../../../domain/repositories/IClassRepository';
import { ApiError } from '../../../shared/errors/ApiError';
export async function updateClass(repo: IClassRepository, id: number, data: any) { const c = await repo.update(id, data); if (!c) throw new ApiError(404,'not_found','Class not found'); return c; }
