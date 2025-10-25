import { Router } from 'express';
import { z } from 'zod';
import { ApiError } from '../../shared/errors/ApiError';
import { StudentRepository } from '../../infrastructure/repositories/StudentRepository';
import { TeacherRepository } from '../../infrastructure/repositories/TeacherRepository';
import { ClassRepository } from '../../infrastructure/repositories/ClassRepository';

const router = Router();

// Zod schema for incremental sync payload
// Define explicit record shapes per entity so TypeScript infers string types
const studentRecord = z.object({
  id: z.number().optional(),
  cpf: z.string().min(1).optional(),
  full_name: z.string().min(1).optional(),
  device_id: z.string().optional(),
});
const teacherRecord = z.object({
  id: z.number().optional(),
  cpf: z.string().min(1).optional(),
  full_name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  password_hash: z.string().optional(),
});
const classRecord = z.object({
  id: z.number().optional(),
  name: z.string().min(1).optional(),
});

const studentChange = z.object({
  action: z.enum(['create', 'update', 'delete']),
  record: studentRecord,
});
const teacherChange = z.object({
  action: z.enum(['create', 'update', 'delete']),
  record: teacherRecord,
});
const classChange = z.object({
  action: z.enum(['create', 'update', 'delete']),
  record: classRecord,
});

const changesSchema = z.object({
  students: z.array(studentChange).optional(),
  teachers: z.array(teacherChange).optional(),
  classes: z.array(classChange).optional(),
});
const syncSchema = z.object({
  source: z.string().min(1),
  timestamp: z.string().min(1), // ISO string; deeper validation could be added
  changes: changesSchema,
});

router.post('/sync', async (req, res, next) => {
  try {
    const parsed = syncSchema.safeParse(req.body);
    if (!parsed.success) {
      const details = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`);
      throw new ApiError(400, 'validation_error', 'Invalid sync payload', details);
    }
    const { changes } = parsed.data;
    const studentRepo = new StudentRepository();
    const teacherRepo = new TeacherRepository();
    const classRepo = new ClassRepository();

    let processed = 0,
      created = 0,
      updated = 0,
      deleted = 0;

    async function handleStudents() {
      for (const item of changes.students || []) {
        processed++;
        const { action, record } = item;
        if (action === 'create') {
          if (!record.cpf || !record.full_name) continue; // required for create
          await studentRepo.create({ cpf: record.cpf, full_name: record.full_name });
          created++;
        } else if (action === 'update') {
          if (record.id == null) continue;
          const existing = await studentRepo.findById(record.id);
          if (!existing) continue;
          const upd = await studentRepo.update(record.id, {
            full_name: record.full_name,
            device_id: record.device_id,
          });
          if (upd) updated++;
        } else if (action === 'delete') {
          if (record.id == null) continue;
          const ok = await studentRepo.delete(record.id);
          if (ok) deleted++;
        }
      }
    }

    async function handleTeachers() {
      for (const item of changes.teachers || []) {
        processed++;
        const { action, record } = item;
        if (action === 'create') {
          if (!record.cpf || !record.full_name || !record.email) continue;
          await teacherRepo.create({
            cpf: record.cpf,
            full_name: record.full_name,
            email: record.email,
            password_hash: record.password_hash,
          });
          created++;
        } else if (action === 'update') {
          if (record.id == null) continue;
          const existing = await teacherRepo.findById(record.id);
          if (!existing) continue;
          const upd = await teacherRepo.update(record.id, {
            full_name: record.full_name,
            email: record.email,
            password_hash: record.password_hash,
          });
          if (upd) updated++;
        } else if (action === 'delete') {
          if (record.id == null) continue;
          const ok = await teacherRepo.delete(record.id);
          if (ok) deleted++;
        }
      }
    }

    async function handleClasses() {
      for (const item of changes.classes || []) {
        processed++;
        const { action, record } = item;
        if (action === 'create') {
          if (!record.name) continue;
          await classRepo.create({ name: record.name });
          created++;
        } else if (action === 'update') {
          if (record.id == null) continue;
          const existing = await classRepo.findById(record.id);
          if (!existing) continue;
          const upd = await classRepo.update(record.id, { name: record.name });
          if (upd) updated++;
        } else if (action === 'delete') {
          if (record.id == null) continue;
          const ok = await classRepo.delete(record.id);
          if (ok) deleted++;
        }
      }
    }

    await handleStudents();
    await handleTeachers();
    await handleClasses();

    res.json({ processed, created, updated, deleted });
  } catch (e) {
    next(e);
  }
});

export default router;
