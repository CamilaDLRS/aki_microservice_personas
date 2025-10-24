import { IStudentRepository, PagedResult, StudentQuery } from '../../domain/repositories/IStudentRepository';
import { Student } from '../../domain/entities/Student';
import { StudentModel } from '../database/models/StudentModel';
import { Op } from 'sequelize';

export class StudentRepository implements IStudentRepository {
  async create(data: Omit<Student['props'], 'id'>): Promise<Student> {
    const created = await StudentModel.create(data as any);
    return new Student(created.toJSON());
  }

  async findById(id: number): Promise<Student | null> {
    const found = await StudentModel.findByPk(id);
    return found ? new Student(found.toJSON()) : null;
  }

  async findByCpf(cpf: string): Promise<Student | null> {
    const found = await StudentModel.findOne({ where: { cpf } });
    return found ? new Student(found.toJSON()) : null;
  }

  async findPaged(query: StudentQuery): Promise<PagedResult<Student>> {
    const where: any = {};
    if (query.q) {
      where[Op.or] = [
        { cpf: { [Op.like]: `%${query.q}%` } },
        { full_name: { [Op.like]: `%${query.q}%` } }
      ];
    }
    const offset = (query.page - 1) * query.size;
    const { rows, count } = await StudentModel.findAndCountAll({ where, limit: query.size, offset, order: [['id', 'ASC']] });
    return {
      meta: { page: query.page, size: query.size, total: count },
      items: rows.map(r => new Student(r.toJSON()))
    };
  }

  async update(id: number, data: Partial<Student['props']>): Promise<Student | null> {
    const found = await StudentModel.findByPk(id);
    if (!found) return null;
    await found.update(data as any);
    return new Student(found.toJSON());
  }

  async delete(id: number): Promise<boolean> {
    const deleted = await StudentModel.destroy({ where: { id } });
    return deleted > 0;
  }
}
