import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import FilterPanel from '../components/FilterPanel.jsx';
import JobCard from '../components/JobCard.jsx';
import SearchBar from '../components/SearchBar.jsx';
import { EmptyState, ErrorState, LoadingState } from '../components/StatusMessage.jsx';
import { getJobs } from '../services/api.js';

const initialFilters = {
  search: '',
  location: '',
  category: '',
  jobType: '',
  experienceLevel: ''
};

export default function BrowseJobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    ...initialFilters,
    search: searchParams.get('search') || ''
  });
  const [jobs, setJobs] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  const activeFilters = useMemo(
    () => Object.entries(filters).filter(([, value]) => Boolean(value)).length,
    [filters]
  );

  const loadJobs = useCallback(async (page = 1, append = false) => {
    try {
      setStatus(append ? 'loadingMore' : 'loading');
      const data = await getJobs({ ...filters, page, limit: 6 });
      setJobs((current) => (append ? [...current, ...data.jobs] : data.jobs));
      setMeta(data.meta);
      setStatus('success');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  }, [filters]);

  useEffect(() => {
    loadJobs(1);
  }, [loadJobs]);

  function handleSearch(keyword) {
    setFilters((current) => ({ ...current, search: keyword }));
    const nextParams = new URLSearchParams(searchParams);
    if (keyword) nextParams.set('search', keyword);
    else nextParams.delete('search');
    setSearchParams(nextParams);
  }

  function resetFilters() {
    setFilters(initialFilters);
    setSearchParams({});
  }

  const hasMore = meta.page < meta.totalPages;

  return (
    <section className="page-section">
      <div className="container page-heading">
        <span className="eyebrow">Browse Jobs</span>
        <h1>Search roles by skill, team, and location.</h1>
      </div>

      <div className="container browse-layout">
        <FilterPanel filters={filters} onChange={setFilters} onReset={resetFilters} />

        <div className="browse-results">
          <div className="results-toolbar">
            <SearchBar initialValue={filters.search} onSearch={handleSearch} />
            <p>
              {meta.total} result{meta.total === 1 ? '' : 's'}
              {activeFilters ? ` with ${activeFilters} active filter${activeFilters === 1 ? '' : 's'}` : ''}
            </p>
          </div>

          {status === 'loading' ? <LoadingState message="Finding jobs..." /> : null}
          {status === 'error' ? <ErrorState message={error} onRetry={() => loadJobs(1)} /> : null}
          {status === 'success' && jobs.length === 0 ? (
            <EmptyState
              title="No matching jobs"
              message="Try removing a filter or posting a new job."
              action={
                <Link className="button button-primary" to="/post-job">
                  Post a Job
                </Link>
              }
            />
          ) : null}

          <div className="job-list">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          {hasMore ? (
            <button
              className="button button-secondary load-more"
              type="button"
              onClick={() => loadJobs(meta.page + 1, true)}
              disabled={status === 'loadingMore'}
            >
              {status === 'loadingMore' ? 'Loading...' : 'Load More'}
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
