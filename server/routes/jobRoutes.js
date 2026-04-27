import { Router } from 'express';
import {
  createJob,
  deleteJob,
  getJob,
  getJobs,
  getMyJobs,
  updateJob
} from '../controllers/jobController.js';
import { requireAuth } from '../middleware/auth.js';
import { validateJob } from '../middleware/validateJob.js';

const router = Router();

router.get('/', getJobs);
router.get('/mine', requireAuth, getMyJobs);
router.get('/:id', getJob);
router.post('/', requireAuth, validateJob, createJob);
router.put('/:id', requireAuth, validateJob, updateJob);
router.delete('/:id', requireAuth, deleteJob);

export default router;
