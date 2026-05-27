import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return <div style={styles.loading}>Chargement...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

const styles = {
  loading: {
    display: 'flex' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    minHeight: '100vh',
    fontSize: '1.2rem',
  },
};

export default ProtectedRoute;
