import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ReactElement } from 'react';
import LoadingState from '../components/Loading/LoadingState';

const PrivateRoute = ({ children }: { children: ReactElement }) => {
  //Get the user context and token
  const { user, loading } = useAuth();
  const token = localStorage.getItem('token');
  if (loading) {
    return <LoadingState />;
  }
  /*
  If the user doesnt exist in the session and there is no token set
  in local storage, then redirect them back to login. 
*/
  if (!user && !token) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
