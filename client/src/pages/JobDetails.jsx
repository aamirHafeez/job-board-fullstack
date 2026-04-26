import { ArrowLeft, CalendarDays, ExternalLink, MapPin } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ErrorState, LoadingState } from '../components/StatusMessage.jsx';
import { getJob } from '../services/api.js';
import { formatDate, formatSalary } from '../utils/formatters.js';

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  const loadJob = useCallback(async () => {
    try {
      setStatus('loading');
      const data = await getJob(id);
      setJob(data.job);
      setStatus('success');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  }, [id]);

  useEffect(() => {
    loadJob();
  }, [loadJob]);

  if (status === 'loading') {
    return (
      <section className="page-section">
        <div className="container">
          <LoadingState message="Loading job details..." />
        </div>
      </section>
    );
  }

  if (status === 'error') {
    return (
      <section className="page-section">
        <div className="container">
          <ErrorState message={error} onRetry={loadJob} />
        </div>
      </section>
    );
  }

  return (
    <section className="page-section">
      <div className="container narrow">
        <Link className="inline-link back-link" to="/jobs">
          <ArrowLeft size={16} aria-hidden="true" />
          Back to jobs
        </Link>

        <article className="details-panel">
          <div className="details-header">
            <div>
              <p className="company-name">{job.company}</p>
              <h1>{job.title}</h1>
            </div>
            {job.isFeatured ? <span className="pill pill-accent">Featured</span> : null}
          </div>

          <div className="details-meta">
            <span>
              <MapPin size={18} aria-hidden="true" />
              {job.location}
            </span>
            <span>{job.jobType}</span>
            <span>{job.experienceLevel}</span>
            <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
            <span>
              <CalendarDays size={18} aria-hidden="true" />
              {formatDate(job.createdAt)}
            </span>
          </div>

          <div className="content-block">
            <h2>About the role</h2>
            <p>{job.description}</p>
          </div>

          <div className="content-block">
            <h2>Requirements</h2>
            <p>{job.requirements}</p>
          </div>

          <div className="details-actions">
            {job.applyUrl ? (
              <a className="button button-primary" href={job.applyUrl} target="_blank" rel="noreferrer">
                Apply Now <ExternalLink size={18} aria-hidden="true" />
              </a>
            ) : (
              <Link className="button button-primary" to="/jobs">
                Browse Similar Jobs
              </Link>
            )}
            <Link className="button button-secondary" to={`/dashboard/jobs/${job.id}/edit`}>
              Edit Job
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
