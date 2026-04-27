import { Router } from 'express';
import { me, signin, signout, signup } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/me', requireAuth, me);
router.post('/signout', requireAuth, signout);

export default router;
