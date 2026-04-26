import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Link className="brand footer-brand" to="/">
            TalentBoard
          </Link>
          <p>Full-stack job board built with React, Express, REST APIs, and MySQL.</p>
        </div>
        <div className="footer-links">
          <Link to="/jobs">Browse Jobs</Link>
          <Link to="/post-job">Post a Job</Link>
          <Link to="/dashboard">Employer Dashboard</Link>
        </div>
      </div>
    </footer>
  );
}
