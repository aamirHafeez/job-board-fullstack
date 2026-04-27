import { LogIn } from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';

export default function SignIn() {
  const { isAuthenticated, signin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const redirectTo = location.state?.from?.pathname || '/dashboard';
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  function updateField(field, value) {
    setFormData((current) => ({ ...current, [field]: value }));
    setError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      await signin(formData);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="page-section auth-section">
      <div className="container auth-layout">
        <div className="auth-copy">
          <span className="eyebrow">Employer Access</span>
          <h1>Sign in to manage your job posts.</h1>
          <p>Use your employer account to create, edit, and remove listings from the dashboard.</p>
        </div>

        <form className="auth-card" onSubmit={handleSubmit} noValidate>
          <h2>Sign in</h2>
          {error ? <div className="alert">{error}</div> : null}

          <label className="field">
            <span>Email</span>
            <input
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={(event) => updateField('email', event.target.value)}
              placeholder="you@company.com"
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={(event) => updateField('password', event.target.value)}
              placeholder="Enter your password"
            />
          </label>

          <button className="button button-primary auth-submit" type="submit" disabled={isSubmitting}>
            <LogIn size={18} aria-hidden="true" />
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>

          <p className="auth-switch">
            New employer? <Link to="/signup">Create an account</Link>
          </p>
        </form>
      </div>
    </section>
  );
}
