import { pool } from '../config/database.js';

const jobSelect = `
  id,
  title,
  company,
  location,
  category,
  job_type AS jobType,
  experience_level AS experienceLevel,
  salary_min AS salaryMin,
  salary_max AS salaryMax,
  description,
  requirements,
  apply_url AS applyUrl,
  is_featured AS isFeatured,
  created_at AS createdAt,
  updated_at AS updatedAt
`;

function buildWhereClause(filters) {
  const conditions = [];
  const values = [];

  if (filters.search) {
    conditions.push('(title LIKE ? OR company LIKE ? OR description LIKE ? OR category LIKE ?)');
    const keyword = `%${filters.search}%`;
    values.push(keyword, keyword, keyword, keyword);
  }

  if (filters.location) {
    conditions.push('location = ?');
    values.push(filters.location);
  }

  if (filters.category) {
    conditions.push('category = ?');
    values.push(filters.category);
  }

  if (filters.jobType) {
    conditions.push('job_type = ?');
    values.push(filters.jobType);
  }

  if (filters.experienceLevel) {
    conditions.push('experience_level = ?');
    values.push(filters.experienceLevel);
  }

  if (filters.featured === 'true' || filters.featured === true) {
    conditions.push('is_featured = 1');
  }

  return {
    whereSql: conditions.length ? `WHERE ${conditions.join(' AND ')}` : '',
    values
  };
}

function normalizeJob(job) {
  if (!job) return null;

  return {
    ...job,
    isFeatured: Boolean(job.isFeatured)
  };
}

export async function findJobs(filters = {}) {
  const page = Math.max(Number(filters.page) || 1, 1);
  const limit = Math.min(Math.max(Number(filters.limit) || 10, 1), 100);
  const offset = (page - 1) * limit;
  const { whereSql, values } = buildWhereClause(filters);

  // Some hosted MySQL plans reject placeholders in LIMIT/OFFSET, so only the
  // already-clamped numeric values are interpolated here.
  const [rows] = await pool.execute(
    `
      SELECT ${jobSelect}
      FROM jobs
      ${whereSql}
      ORDER BY is_featured DESC, created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `,
    values
  );

  const [countRows] = await pool.execute(
    `
      SELECT COUNT(*) AS total
      FROM jobs
      ${whereSql}
    `,
    values
  );

  const total = countRows[0].total;

  return {
    jobs: rows.map(normalizeJob),
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1
    }
  };
}

export async function findJobById(id) {
  const [rows] = await pool.execute(
    `
      SELECT ${jobSelect}
      FROM jobs
      WHERE id = ?
      LIMIT 1
    `,
    [id]
  );

  return normalizeJob(rows[0]);
}

export async function createJob(job) {
  const [result] = await pool.execute(
    `
      INSERT INTO jobs (
        title,
        company,
        location,
        category,
        job_type,
        experience_level,
        salary_min,
        salary_max,
        description,
        requirements,
        apply_url,
        is_featured
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      job.title,
      job.company,
      job.location,
      job.category,
      job.jobType,
      job.experienceLevel,
      job.salaryMin,
      job.salaryMax,
      job.description,
      job.requirements,
      job.applyUrl || null,
      job.isFeatured ? 1 : 0
    ]
  );

  return findJobById(result.insertId);
}

export async function updateJob(id, job) {
  await pool.execute(
    `
      UPDATE jobs
      SET
        title = ?,
        company = ?,
        location = ?,
        category = ?,
        job_type = ?,
        experience_level = ?,
        salary_min = ?,
        salary_max = ?,
        description = ?,
        requirements = ?,
        apply_url = ?,
        is_featured = ?
      WHERE id = ?
    `,
    [
      job.title,
      job.company,
      job.location,
      job.category,
      job.jobType,
      job.experienceLevel,
      job.salaryMin,
      job.salaryMax,
      job.description,
      job.requirements,
      job.applyUrl || null,
      job.isFeatured ? 1 : 0,
      id
    ]
  );

  return findJobById(id);
}

export async function deleteJob(id) {
  const [result] = await pool.execute('DELETE FROM jobs WHERE id = ?', [id]);
  return result.affectedRows > 0;
}
