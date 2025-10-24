import { Router } from 'express';
import { TeacherController } from '../controllers/TeacherController';
import { z } from 'zod';
import { ApiError } from '../../shared/errors/ApiError';

const controller = new TeacherController();
const router = Router();

const createSchema = z.object({ cpf: z.string().length(11), full_name: z.string().min(2), email: z.string().email(), password_hash: z.string().optional().nullable() });
const updateSchema = z.object({ full_name: z.string().min(2).optional(), email: z.string().email().optional(), password_hash: z.string().optional().nullable() });

function validate(schema: any) { return (req: any,_res:any,next:any)=>{ const r = schema.safeParse(req.body); if(!r.success){ const details = r.error.issues.map((i:any)=>`${i.path.join('.')}: ${i.message}`); return next(new ApiError(400,'validation_error','Invalid request body',details)); } req.body = r.data; next(); }; }

router.get('/', (req,res,next)=>controller.list(req,res,next));
router.post('/', validate(createSchema), (req,res,next)=>controller.create(req,res,next));
router.get('/:teacherId', (req,res,next)=>controller.get(req,res,next));
router.put('/:teacherId', validate(updateSchema), (req,res,next)=>controller.update(req,res,next));
router.delete('/:teacherId', (req,res,next)=>controller.delete(req,res,next));

export default router;
