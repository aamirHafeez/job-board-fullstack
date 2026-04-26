const allowedJobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
const allowedExperienceLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Lead'];

function isValidUrl(value) {
  if (!value) return true;

  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
}

export function validateJob(req, res, next) {
  const {
    title,
    company,
    location,
    category,
    jobType,
    experienceLevel,
    salaryMin,
    salaryMax,
    description,
    requirements,
    applyUrl
  } = req.body;

  const errors = [];

  if (!title || title.trim().length < 3) errors.push('Job title must be at least 3 characters.');
  if (!company || company.trim().length < 2) errors.push('Company name is required.');
  if (!location || location.trim().length < 2) errors.push('Location is required.');
  if (!category || category.trim().length < 2) errors.push('Category is required.');
  if (!allowedJobTypes.includes(jobType)) errors.push('Job type is invalid.');
  if (!allowedExperienceLevels.includes(experienceLevel)) errors.push('Experience level is invalid.');
  if (!description || description.trim().length < 40) errors.push('Description must be at least 40 characters.');
  if (!requirements || requirements.trim().length < 20) errors.push('Requirements must be at least 20 characters.');
  if (!isValidUrl(applyUrl)) errors.push('Apply URL must be a valid http or https URL.');

  if (salaryMin !== null && salaryMin !== undefined && salaryMin !== '' && Number.isNaN(Number(salaryMin))) {
    errors.push('Minimum salary must be a number.');
  }

  if (salaryMax !== null && salaryMax !== undefined && salaryMax !== '' && Number.isNaN(Number(salaryMax))) {
    errors.push('Maximum salary must be a number.');
  }

  if (Number(salaryMin) > 0 && Number(salaryMax) > 0 && Number(salaryMin) > Number(salaryMax)) {
    errors.push('Maximum salary must be higher than minimum salary.');
  }

  if (errors.length) {
    return res.status(400).json({
      message: 'Validation failed.',
      errors
    });
  }

  req.body.title = title.trim();
  req.body.company = company.trim();
  req.body.location = location.trim();
  req.body.category = category.trim();
  req.body.description = description.trim();
  req.body.requirements = requirements.trim();
  req.body.applyUrl = applyUrl ? applyUrl.trim() : null;
  req.body.salaryMin = salaryMin === '' ? null : salaryMin;
  req.body.salaryMax = salaryMax === '' ? null : salaryMax;
  req.body.isFeatured = Boolean(req.body.isFeatured);

  next();
}
