import { Save } from 'lucide-react';
import { useMemo, useState } from 'react';

const emptyJob = {
  title: '',
  company: '',
  location: '',
  category: '',
  jobType: 'Full-time',
  experienceLevel: 'Mid Level',
  salaryMin: '',
  salaryMax: '',
  description: '',
  requirements: '',
  applyUrl: '',
  isFeatured: false
};

const categories = ['Engineering', 'Design', 'Marketing', 'Product', 'Sales', 'Customer Success', 'Data'];
const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
const experienceLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Lead'];

export default function JobForm({ initialJob, onSubmit, submitLabel = 'Save job', isSubmitting = false }) {
  const [formData, setFormData] = useState(() => ({ ...emptyJob, ...initialJob }));
  const [errors, setErrors] = useState({});

  const titleCount = useMemo(() => formData.title.length, [formData.title]);

  function updateField(field, value) {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
  }

  function validate() {
    const nextErrors = {};

    if (formData.title.trim().length < 3) nextErrors.title = 'Job title must be at least 3 characters.';
    if (formData.company.trim().length < 2) nextErrors.company = 'Company name is required.';
    if (formData.location.trim().length < 2) nextErrors.location = 'Location is required.';
    if (!formData.category) nextErrors.category = 'Choose a category.';
    if (formData.description.trim().length < 40) nextErrors.description = 'Description must be at least 40 characters.';
    if (formData.requirements.trim().length < 20) nextErrors.requirements = 'Requirements must be at least 20 characters.';
    if (formData.applyUrl && !/^https?:\/\/.+/i.test(formData.applyUrl)) {
      nextErrors.applyUrl = 'Apply URL must start with http:// or https://.';
    }

    const min = Number(formData.salaryMin);
    const max = Number(formData.salaryMax);

    if (formData.salaryMin && Number.isNaN(min)) nextErrors.salaryMin = 'Minimum salary must be a number.';
    if (formData.salaryMax && Number.isNaN(max)) nextErrors.salaryMax = 'Maximum salary must be a number.';
    if (min && max && min > max) nextErrors.salaryMax = 'Maximum salary must be higher than minimum salary.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!validate()) return;

    onSubmit({
      ...formData,
      salaryMin: formData.salaryMin === '' ? null : Number(formData.salaryMin),
      salaryMax: formData.salaryMax === '' ? null : Number(formData.salaryMax)
    });
  }

  return (
    <form className="job-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid two-columns">
        <label className="field">
          <span>Job title</span>
          <input
            value={formData.title}
            maxLength={120}
            onChange={(event) => updateField('title', event.target.value)}
            placeholder="Senior Frontend Engineer"
          />
          <small>{titleCount}/120</small>
          {errors.title ? <strong className="field-error">{errors.title}</strong> : null}
        </label>

        <label className="field">
          <span>Company</span>
          <input
            value={formData.company}
            onChange={(event) => updateField('company', event.target.value)}
            placeholder="Acme Labs"
          />
          {errors.company ? <strong className="field-error">{errors.company}</strong> : null}
        </label>

        <label className="field">
          <span>Location</span>
          <input
            value={formData.location}
            onChange={(event) => updateField('location', event.target.value)}
            placeholder="Remote"
          />
          {errors.location ? <strong className="field-error">{errors.location}</strong> : null}
        </label>

        <label className="field">
          <span>Category</span>
          <select value={formData.category} onChange={(event) => updateField('category', event.target.value)}>
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category ? <strong className="field-error">{errors.category}</strong> : null}
        </label>

        <label className="field">
          <span>Job type</span>
          <select value={formData.jobType} onChange={(event) => updateField('jobType', event.target.value)}>
            {jobTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Experience level</span>
          <select
            value={formData.experienceLevel}
            onChange={(event) => updateField('experienceLevel', event.target.value)}
          >
            {experienceLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Minimum salary</span>
          <input
            value={formData.salaryMin ?? ''}
            inputMode="numeric"
            onChange={(event) => updateField('salaryMin', event.target.value)}
            placeholder="90000"
          />
          {errors.salaryMin ? <strong className="field-error">{errors.salaryMin}</strong> : null}
        </label>

        <label className="field">
          <span>Maximum salary</span>
          <input
            value={formData.salaryMax ?? ''}
            inputMode="numeric"
            onChange={(event) => updateField('salaryMax', event.target.value)}
            placeholder="130000"
          />
          {errors.salaryMax ? <strong className="field-error">{errors.salaryMax}</strong> : null}
        </label>
      </div>

      <label className="field">
        <span>Job description</span>
        <textarea
          rows="6"
          value={formData.description}
          onChange={(event) => updateField('description', event.target.value)}
          placeholder="Describe the role, team, and impact."
        />
        {errors.description ? <strong className="field-error">{errors.description}</strong> : null}
      </label>

      <label className="field">
        <span>Requirements</span>
        <textarea
          rows="5"
          value={formData.requirements}
          onChange={(event) => updateField('requirements', event.target.value)}
          placeholder="List skills, experience, and qualifications."
        />
        {errors.requirements ? <strong className="field-error">{errors.requirements}</strong> : null}
      </label>

      <label className="field">
        <span>Apply URL</span>
        <input
          value={formData.applyUrl ?? ''}
          onChange={(event) => updateField('applyUrl', event.target.value)}
          placeholder="https://company.com/careers/job"
        />
        {errors.applyUrl ? <strong className="field-error">{errors.applyUrl}</strong> : null}
      </label>

      <label className="checkbox-field">
        <input
          type="checkbox"
          checked={Boolean(formData.isFeatured)}
          onChange={(event) => updateField('isFeatured', event.target.checked)}
        />
        <span>Feature this job on the home page</span>
      </label>

      <button className="button button-primary form-submit" type="submit" disabled={isSubmitting}>
        <Save size={18} aria-hidden="true" />
        {isSubmitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
