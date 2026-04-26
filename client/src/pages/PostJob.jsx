import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import JobForm from '../components/JobForm.jsx';
import { createJob } from '../services/api.js';

export default function PostJob() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(payload) {
    try {
      setIsSubmitting(true);
      setError('');
      const data = await createJob(payload);
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
        <div className="page-heading">
          <span className="eyebrow">Post a Job</span>
          <h1>Create a professional job listing.</h1>
          <p>Frontend and backend validation are both included for a realistic portfolio workflow.</p>
        </div>
        {error ? <div className="alert">{error}</div> : null}
        <JobForm onSubmit={handleSubmit} submitLabel="Create job" isSubmitting={isSubmitting} />
      </div>
    </section>
  );
}
