import { IClassRepository } from '../../../domain/repositories/IClassRepository';
import { ApiError } from '../../../shared/errors/ApiError';
export async function removeTeacherFromClass(repo: IClassRepository, classId: number, teacherId: number) {
	const cls = await repo.findById(classId);
	if (!cls) throw new ApiError(404, 'not_found', 'Class not found');
	const current = await repo.listTeachers(classId);
	if (!current.includes(teacherId)) throw new ApiError(404, 'not_found', 'Teacher not in class');
	await repo.removeTeacher(classId, teacherId);
}
