import { Router } from 'express';
import { ClassController } from '../controllers/ClassController';
import { z } from 'zod';
import { ApiError } from '../../shared/errors/ApiError';

const controller = new ClassController();
const router = Router();

const createSchema = z.object({ name: z.string().min(2) });
const updateSchema = z.object({ name: z.string().min(2).optional() });
const linkStudentSchema = z.object({ student_id: z.number() });
const linkTeacherSchema = z.object({ teacher_id: z.number() });

function validate(schema: any) { return (req: any,_res:any,next:any)=>{ const r = schema.safeParse(req.body); if(!r.success){ const details = r.error.issues.map((i:any)=>`${i.path.join('.')}: ${i.message}`); return next(new ApiError(400,'validation_error','Invalid request body',details)); } req.body = r.data; next(); }; }

router.get('/', (req,res,next)=>controller.list(req,res,next));
router.post('/', validate(createSchema), (req,res,next)=>controller.create(req,res,next));
router.get('/:classId', (req,res,next)=>controller.get(req,res,next));
router.put('/:classId', validate(updateSchema), (req,res,next)=>controller.update(req,res,next));
router.delete('/:classId', (req,res,next)=>controller.delete(req,res,next));

router.get('/:classId/students', (req,res,next)=>controller.listStudents(req,res,next));
router.post('/:classId/students', validate(linkStudentSchema), (req,res,next)=>controller.addStudent(req,res,next));
router.delete('/:classId/students/:studentId', (req,res,next)=>controller.removeStudent(req,res,next));

router.get('/:classId/teachers', (req,res,next)=>controller.listTeachers(req,res,next));
router.post('/:classId/teachers', validate(linkTeacherSchema), (req,res,next)=>controller.addTeacher(req,res,next));
router.delete('/:classId/teachers/:teacherId', (req,res,next)=>controller.removeTeacher(req,res,next));

export default router;
