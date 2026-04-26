import { ArrowRight, Building2, Filter, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import JobCard from '../components/JobCard.jsx';
import SearchBar from '../components/SearchBar.jsx';
import { EmptyState, ErrorState, LoadingState } from '../components/StatusMessage.jsx';
import { getJobs } from '../services/api.js';

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  async function loadFeaturedJobs() {
    try {
      setStatus('loading');
      const data = await getJobs({ featured: true, limit: 3 });
      setJobs(data.jobs);
      setStatus('success');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  }

  useEffect(() => {
    loadFeaturedJobs();
  }, []);

  function handleHeroSearch(keyword) {
    const query = keyword ? `?search=${encodeURIComponent(keyword)}` : '';
    window.location.assign(`/jobs${query}`);
  }

  return (
    <>
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Portfolio-ready full-stack project</span>
            <h1>Find the right role from trusted companies.</h1>
            <p>
              TalentBoard is a modern job board with search, filtering, CRUD workflows, REST APIs, and a MySQL-backed
              employer dashboard.
            </p>
            <SearchBar onSearch={handleHeroSearch} placeholder="Try Frontend, Remote, Product..." />
            <div className="hero-actions">
              <Link className="button button-primary" to="/jobs">
                Browse Jobs <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link className="button button-secondary" to="/post-job">
                Post a Job
              </Link>
            </div>
          </div>

          <div className="hero-panel" aria-label="Project highlights">
            <div className="metric-card">
              <strong>REST API</strong>
              <span>Express endpoints for jobs CRUD and filtering</span>
            </div>
            <div className="metric-card">
              <strong>MySQL</strong>
              <span>Schema and seed data included</span>
            </div>
            <div className="metric-card">
              <strong>Responsive</strong>
              <span>Mobile, tablet, and desktop layouts</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container section-heading">
          <span className="eyebrow">Featured openings</span>
          <div>
            <h2>Fresh jobs for ambitious teams</h2>
            <p>Seeded listings make the app feel alive immediately after setup.</p>
          </div>
        </div>

        <div className="container job-list">
          {status === 'loading' ? <LoadingState message="Loading featured jobs..." /> : null}
          {status === 'error' ? <ErrorState message={error} onRetry={loadFeaturedJobs} /> : null}
          {status === 'success' && jobs.length === 0 ? (
            <EmptyState title="No featured jobs yet" message="Create a featured job from the employer dashboard." />
          ) : null}
          {status === 'success' ? jobs.map((job) => <JobCard key={job.id} job={job} />) : null}
        </div>
      </section>

      <section className="section muted-section">
        <div className="container feature-grid">
          <article className="feature-item">
            <Building2 size={28} aria-hidden="true" />
            <h3>Employer CRUD</h3>
            <p>Create, edit, and delete postings through a simple dashboard workflow.</p>
          </article>
          <article className="feature-item">
            <Filter size={28} aria-hidden="true" />
            <h3>Smart browsing</h3>
            <p>Search and filter by keyword, location, category, job type, and level.</p>
          </article>
          <article className="feature-item">
            <ShieldCheck size={28} aria-hidden="true" />
            <h3>Validated data</h3>
            <p>Frontend and backend validation keep the database clean and predictable.</p>
          </article>
        </div>
      </section>
    </>
  );
}
