import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="page-section">
      <div className="container narrow">
        <div className="not-found">
          <span className="eyebrow">404</span>
          <h1>Page not found.</h1>
          <p>The page you are looking for does not exist or may have moved.</p>
          <Link className="button button-primary" to="/">
            Back Home
          </Link>
        </div>
      </div>
    </section>
  );
}
