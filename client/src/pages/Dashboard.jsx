import { Edit, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState, ErrorState, LoadingState } from '../components/StatusMessage.jsx';
import { deleteJob, getMyJobs } from '../services/api.js';
import { formatDate } from '../utils/formatters.js';

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  async function loadJobs() {
    try {
      setStatus('loading');
      const data = await getMyJobs({ limit: 100 });
      setJobs(data.jobs);
      setStatus('success');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  }

  useEffect(() => {
    loadJobs();
  }, []);

  async function handleDelete(jobId) {
    const confirmed = window.confirm('Delete this job post? This action cannot be undone.');
    if (!confirmed) return;

    try {
      setDeletingId(jobId);
      await deleteJob(jobId);
      setJobs((current) => current.filter((job) => job.id !== jobId));
    } catch (err) {
      setError(err.message);
      setStatus('error');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="page-section">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <span className="eyebrow">Employer Dashboard</span>
            <h1>Manage job posts.</h1>
          </div>
          <Link className="button button-primary" to="/post-job">
            <Plus size={18} aria-hidden="true" />
            New Job
          </Link>
        </div>

        {status === 'loading' ? <LoadingState message="Loading dashboard..." /> : null}
        {status === 'error' ? <ErrorState message={error} onRetry={loadJobs} /> : null}
        {status === 'success' && jobs.length === 0 ? (
          <EmptyState
            title="No jobs yet"
            message="Create the first employer listing to populate the dashboard."
            action={
              <Link className="button button-primary" to="/post-job">
                Post a Job
              </Link>
            }
          />
        ) : null}

        {status === 'success' && jobs.length > 0 ? (
          <div className="table-card">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Company</th>
                  <th>Type</th>
                  <th>Posted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td>
                      <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                      <span>{job.location}</span>
                    </td>
                    <td>{job.company}</td>
                    <td>{job.jobType}</td>
                    <td>{formatDate(job.createdAt)}</td>
                    <td>
                      <div className="table-actions">
                        <Link className="icon-button" to={`/dashboard/jobs/${job.id}/edit`} aria-label={`Edit ${job.title}`}>
                          <Edit size={18} />
                        </Link>
                        <button
                          className="icon-button danger"
                          type="button"
                          onClick={() => handleDelete(job.id)}
                          aria-label={`Delete ${job.title}`}
                          disabled={deletingId === job.id}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </section>
  );
}
