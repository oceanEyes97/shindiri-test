import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import SignUpComponent from '../pages/SignUp';
import ResetPasswordComponent from '../pages/ResetPassword';
import CharactersPage from '../pages/Characters';
import SingleCharacter from '../pages/SingleCharacter';
import SingleLocation from '../pages/SingleLocation';
import SingleEpisode from '../pages/SingelEpisode';
import PrivateRoute from './PrivateRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/sign-up" element={<SignUpComponent />} />
      <Route path="/reset-password" element={<ResetPasswordComponent />} />
      <Route
        path="/characters"
        element={
          <PrivateRoute>
            <CharactersPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/characters/:id"
        element={
          <PrivateRoute>
            <SingleCharacter />
          </PrivateRoute>
        }
      />
      <Route
        path="/location/:id"
        element={
          <PrivateRoute>
            <SingleLocation />
          </PrivateRoute>
        }
      />
      <Route
        path="/episode/:id"
        element={
          <PrivateRoute>
            <SingleEpisode />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
