import { IClassRepository, ClassQuery } from '../../domain/repositories/IClassRepository';
import { ClassEntity } from '../../domain/entities/Class';
import { ClassModel } from '../database/models/ClassModel';
import { ClassStudentModel } from '../database/models/ClassStudentModel';
import { ClassTeacherModel } from '../database/models/ClassTeacherModel';
import { PagedResult } from '../../domain/repositories/IStudentRepository';

export { ClassTeacherModel };

export class ClassRepository implements IClassRepository {
  async create(data: Omit<ClassEntity['props'], 'id'>): Promise<ClassEntity> {
    const c = await ClassModel.create(data as any);
    return new ClassEntity(c.toJSON());
  }

  async findById(id: number): Promise<ClassEntity | null> {
    const c = await ClassModel.findByPk(id);
    if (c) {
      return new ClassEntity(c.toJSON());
    } else {
      return null;
    }
  }

  async findPaged(q: ClassQuery): Promise<PagedResult<ClassEntity>> {
    const offset = (q.page - 1) * q.size;
    const { rows, count } = await ClassModel.findAndCountAll({
      limit: q.size,
      offset,
      order: [['id', 'ASC']],
    });
    return {
      meta: { page: q.page, size: q.size, total: count },
      items: rows.map((r) => new ClassEntity(r.toJSON())),
    };
  }

  async update(id: number, data: Partial<ClassEntity['props']>): Promise<ClassEntity | null> {
    const c = await ClassModel.findByPk(id);
    if (!c) {
      return null;
    }
    await c.update(data as any);
    return new ClassEntity(c.toJSON());
  }

  async delete(id: number): Promise<boolean> {
    return (await ClassModel.destroy({ where: { id } })) > 0;
  }

  async addStudent(classId: number, studentId: number): Promise<void> {
    await ClassStudentModel.create({
      class_id: classId,
      student_id: studentId,
    } as any);
  }

  async removeStudent(classId: number, studentId: number): Promise<void> {
    await ClassStudentModel.destroy({
      where: {
        class_id: classId,
        student_id: studentId,
      },
    });
  }

  async addTeacher(classId: number, teacherId: number): Promise<void> {
    await ClassTeacherModel.create({
      class_id: classId,
      teacher_id: teacherId,
    } as any);
  }

  async removeTeacher(classId: number, teacherId: number): Promise<void> {
    await ClassTeacherModel.destroy({
      where: {
        class_id: classId,
        teacher_id: teacherId,
      },
    });
  }

  async listStudents(classId: number): Promise<number[]> {
    const rows = await ClassStudentModel.findAll({
      where: {
        class_id: classId,
      },
      attributes: ['student_id'],
      raw: true,
    });
    return rows.map((r: any) => r.student_id);
  }

  async listTeachers(classId: number): Promise<number[]> {
    const rows = await ClassTeacherModel.findAll({
      where: {
        class_id: classId,
      },
      attributes: ['teacher_id'],
      raw: true,
    });
    return rows.map((r: any) => r.teacher_id);
  }
}
