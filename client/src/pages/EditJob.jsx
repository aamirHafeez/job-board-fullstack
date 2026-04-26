import { ArrowLeft } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import JobForm from '../components/JobForm.jsx';
import { ErrorState, LoadingState } from '../components/StatusMessage.jsx';
import { getJob, updateJob } from '../services/api.js';

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  async function handleSubmit(payload) {
    try {
      setIsSubmitting(true);
      setError('');
      const data = await updateJob(id, payload);
      navigate(`/jobs/${data.job.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="page-section">
      <div className="container narrow">
        <Link className="inline-link back-link" to="/dashboard">
          <ArrowLeft size={16} aria-hidden="true" />
          Back to dashboard
        </Link>

        <div className="page-heading">
          <span className="eyebrow">Edit Job</span>
          <h1>Update listing details.</h1>
        </div>

        {status === 'loading' ? <LoadingState message="Loading job..." /> : null}
        {status === 'error' ? <ErrorState message={error} onRetry={loadJob} /> : null}
        {error && status === 'success' ? <div className="alert">{error}</div> : null}
        {status === 'success' ? (
          <JobForm initialJob={job} onSubmit={handleSubmit} submitLabel="Update job" isSubmitting={isSubmitting} />
        ) : null}
      </div>
    </section>
  );
}
