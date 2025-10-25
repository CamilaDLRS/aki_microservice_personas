import { ITeacherRepository, TeacherQuery } from '../../domain/repositories/ITeacherRepository';
import { Teacher } from '../../domain/entities/Teacher';
import { TeacherModel } from '../database/models/TeacherModel';
import { PagedResult } from '../../domain/repositories/IStudentRepository';

export class TeacherRepository implements ITeacherRepository {
  async create(data: Omit<Teacher['props'], 'id'>): Promise<Teacher> {
    const created = await TeacherModel.create(data as any);
    return new Teacher(created.toJSON());
  }

  async findById(id: number): Promise<Teacher | null> {
    const found = await TeacherModel.findByPk(id);
    if (found) {
      return new Teacher(found.toJSON());
    } else {
      return null;
    }
  }

  async findPaged(q: TeacherQuery): Promise<PagedResult<Teacher>> {
    const offset = (q.page - 1) * q.size;
    const { rows, count } = await TeacherModel.findAndCountAll({
      limit: q.size,
      offset,
      order: [['id', 'ASC']],
    });
    return {
      meta: { page: q.page, size: q.size, total: count },
      items: rows.map((r) => new Teacher(r.toJSON())),
    };
  }

  async update(id: number, data: Partial<Teacher['props']>): Promise<Teacher | null> {
    const found = await TeacherModel.findByPk(id);
    if (!found) {
      return null;
    }
    await found.update(data as any);
    return new Teacher(found.toJSON());
  }

  async delete(id: number): Promise<boolean> {
    return (await TeacherModel.destroy({ where: { id } })) > 0;
  }
}
