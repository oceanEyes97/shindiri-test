// src/App.tsx
import { BrowserRouter, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import Navigation from "./components/Navigation/Navigation"; // ✅ FIXED: this was missing
import { ReactElement } from "react";

// We export this wrapper as default
function AppWrapper(): ReactElement {
  return (
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  );
}

// This is the inner App that uses hooks
function App(): ReactElement {
  const location = useLocation();
  const { user } = useAuth();

  const publicRoutes = ["/", "/sign-up", "/reset-password"];
  const isPublic = publicRoutes.includes(location.pathname);

  return (
    <>
      {user && !isPublic && <Navigation />}
      <AppRoutes />
    </>
  );
}

export default AppWrapper;
