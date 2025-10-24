import { IClassRepository } from '../../../domain/repositories/IClassRepository';
import { ApiError } from '../../../shared/errors/ApiError';
export async function removeStudentFromClass(repo: IClassRepository, classId: number, studentId: number) {
	const cls = await repo.findById(classId);
	if (!cls) throw new ApiError(404, 'not_found', 'Class not found');
	const current = await repo.listStudents(classId);
	if (!current.includes(studentId)) throw new ApiError(404, 'not_found', 'Student not in class');
	await repo.removeStudent(classId, studentId);
}
