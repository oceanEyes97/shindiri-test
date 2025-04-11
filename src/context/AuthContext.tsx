import { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { AuthContextType } from '../types/auth';

//Creating the Auth context
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser); // Sets the Firebase user or null
      setLoading(false); // Tells the app that auth status has been checked
    });

    return () => unsubscribe(); // Cleans up the listener when component unmounts
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>{!loading && children}</AuthContext.Provider>
  );
};

//Exporting context to be used by components
export const useAuth = () => useContext(AuthContext);
