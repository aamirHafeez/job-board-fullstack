import { UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';

export default function SignUp() {
  const { isAuthenticated, signup } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const redirectTo = location.state?.from?.pathname || '/dashboard';
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
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

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    try {
      setIsSubmitting(true);
      await signup(formData);
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
          <span className="eyebrow">Create Account</span>
          <h1>Start posting jobs in minutes.</h1>
          <p>Create an employer profile and keep your dashboard actions protected behind sign-in.</p>
        </div>

        <form className="auth-card" onSubmit={handleSubmit} noValidate>
          <h2>Sign up</h2>
          {error ? <div className="alert">{error}</div> : null}

          <label className="field">
            <span>Name</span>
            <input
              autoComplete="name"
              value={formData.name}
              onChange={(event) => updateField('name', event.target.value)}
              placeholder="Aamir Hafeez"
            />
          </label>

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
              autoComplete="new-password"
              value={formData.password}
              onChange={(event) => updateField('password', event.target.value)}
              placeholder="At least 8 characters"
            />
          </label>

          <button className="button button-primary auth-submit" type="submit" disabled={isSubmitting}>
            <UserPlus size={18} aria-hidden="true" />
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>

          <p className="auth-switch">
            Already have an account? <Link to="/signin">Sign in</Link>
          </p>
        </form>
      </div>
    </section>
  );
}
