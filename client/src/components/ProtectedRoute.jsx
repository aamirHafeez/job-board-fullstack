import { Navigate, useLocation } from 'react-router-dom';
import { LoadingState } from './StatusMessage.jsx';
import { useAuth } from '../context/useAuth.js';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isChecking } = useAuth();
  const location = useLocation();

  if (isChecking) {
    return (
      <section className="page-section">
        <div className="container">
          <LoadingState message="Checking your session..." />
        </div>
      </section>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  return children;
}
