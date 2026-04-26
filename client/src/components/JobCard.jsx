import { ArrowRight, Briefcase, DollarSign, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatSalary } from '../utils/formatters.js';

export default function JobCard({ job, compact = false }) {
  return (
    <article className={`job-card ${compact ? 'job-card-compact' : ''}`}>
      <div className="job-card-top">
        <div>
          <p className="company-name">{job.company}</p>
          <h3>
            <Link to={`/jobs/${job.id}`}>{job.title}</Link>
          </h3>
        </div>
        {job.isFeatured ? <span className="pill pill-accent">Featured</span> : null}
      </div>

      <div className="job-meta">
        <span>
          <MapPin size={16} aria-hidden="true" />
          {job.location}
        </span>
        <span>
          <Briefcase size={16} aria-hidden="true" />
          {job.jobType}
        </span>
        <span>
          <DollarSign size={16} aria-hidden="true" />
          {formatSalary(job.salaryMin, job.salaryMax)}
        </span>
      </div>

      {!compact ? <p className="job-description">{job.description}</p> : null}

      <div className="job-card-bottom">
        <span className="pill">{job.category}</span>
        <span className="pill">{job.experienceLevel}</span>
        <Link className="inline-link" to={`/jobs/${job.id}`}>
          Details <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
