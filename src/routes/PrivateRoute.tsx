import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ReactElement } from 'react';
import LoadingState from '../components/Loading/LoadingState';

const PrivateRoute = ({ children }: { children: ReactElement }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingState />;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
