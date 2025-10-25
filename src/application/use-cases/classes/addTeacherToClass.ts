import { IClassRepository } from '../../../domain/repositories/IClassRepository';
import { ITeacherRepository } from '../../../domain/repositories/ITeacherRepository';
import { ApiError } from '../../../shared/errors/ApiError';

export async function addTeacherToClass(
	classRepo: IClassRepository,
	teacherRepo: ITeacherRepository,
	classId: number,
	teacherId: number
) {
	const cls = await classRepo.findById(classId);
	if (!cls) {
		throw new ApiError(404, 'not_found', 'Class not found');
	}
	const teacher = await teacherRepo.findById(teacherId);
	if (!teacher) {
		throw new ApiError(404, 'not_found', 'Teacher not found');
	}
	const existingIds = await classRepo.listTeachers(classId);
	if (existingIds.includes(teacherId)) {
		throw new ApiError(409, 'conflict', 'Teacher already in class');
	}
	await classRepo.addTeacher(classId, teacherId);
}
