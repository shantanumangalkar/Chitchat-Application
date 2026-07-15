import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loading from './Loading';

/**
 * Route guard to prevent unauthenticated access.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading fullScreen={true} text="Verifying session security..." />;
  }

  if (!isAuthenticated) {
    // Redirect unauthenticated user to login screen
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
