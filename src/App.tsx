import { BrowserRouter, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import Navigation from './components/Navigation/Navigation';
import { ReactElement } from 'react';

// Wrapping the app with routing and context
function AppWrapper(): ReactElement {
  return (
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  );
}

// App checks if the user is logged in to render the Navigation
function App(): ReactElement {
  const location = useLocation();
  const { user } = useAuth();

  const publicRoutes = ['/', '/sign-up', '/reset-password'];
  const isPublic = publicRoutes.includes(location.pathname);

  return (
    <>
      {user && !isPublic && <Navigation />}
      <AppRoutes />
    </>
  );
}

export default AppWrapper;
