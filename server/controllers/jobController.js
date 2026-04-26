import * as jobModel from '../models/jobModel.js';

export async function getJobs(req, res, next) {
  try {
    const result = await jobModel.findJobs(req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getJob(req, res, next) {
  try {
    const job = await jobModel.findJobById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found.' });
    }

    res.json({ job });
  } catch (error) {
    next(error);
  }
}

export async function createJob(req, res, next) {
  try {
    const job = await jobModel.createJob(req.body);
    res.status(201).json({ message: 'Job created successfully.', job });
  } catch (error) {
    next(error);
  }
}

export async function updateJob(req, res, next) {
  try {
    const existingJob = await jobModel.findJobById(req.params.id);

    if (!existingJob) {
      return res.status(404).json({ message: 'Job not found.' });
    }

    const job = await jobModel.updateJob(req.params.id, req.body);
    res.json({ message: 'Job updated successfully.', job });
  } catch (error) {
    next(error);
  }
}

export async function deleteJob(req, res, next) {
  try {
    const deleted = await jobModel.deleteJob(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Job not found.' });
    }

    res.json({ message: 'Job deleted successfully.' });
  } catch (error) {
    next(error);
  }
}
