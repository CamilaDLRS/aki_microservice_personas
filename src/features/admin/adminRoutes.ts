import { Router } from 'express';

const router = Router();

// Example admin route
router.get('/', (req, res) => {
  // @ts-expect-error
  if (req.auth.roles.includes('admin')) {
    res.json({ message: 'Welcome admin' });
  } else {
    res.status(403).json({ message: 'Forbidden' });
  }
});

export default router;