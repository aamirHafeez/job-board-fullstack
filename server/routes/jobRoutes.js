import { Router } from 'express';
import {
  createJob,
  deleteJob,
  getJob,
  getJobs,
  updateJob
} from '../controllers/jobController.js';
import { validateJob } from '../middleware/validateJob.js';

const router = Router();

router.get('/', getJobs);
router.get('/:id', getJob);
router.post('/', validateJob, createJob);
router.put('/:id', validateJob, updateJob);
router.delete('/:id', deleteJob);

export default router;
