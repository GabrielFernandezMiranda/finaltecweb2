import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { User, AuthContextType, LoginCredentials } from '../interfaces/auth';

const PREDEFINED_USERS: User[] = [
  {
    id: '1',
    username: 'admin',
    name: 'Administrador',
    email: 'admin@spacenews.com',
    role: 'admin',
  },
  {
    id: '2',
    username: 'user',
    name: 'Usuario',
    email: 'user@spacenews.com',
    role: 'user',
  },
];

const PASSWORDS: Record<string, string> = {
  admin: 'admin123',
  user: 'user123',
};

const AUTH_KEY = 'spacenews_auth';

interface AuthContextValue extends AuthContextType {}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      try {
        return JSON.parse(stored) as User;
      } catch {
        localStorage.removeItem(AUTH_KEY);
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const foundUser = PREDEFINED_USERS.find(
      (u) => u.username === credentials.username
    );

    if (!foundUser) {
      setLoading(false);
      return { success: false, error: 'Usuario no encontrado' };
    }

    if (PASSWORDS[credentials.username] !== credentials.password) {
      setLoading(false);
      return { success: false, error: 'Contraseña incorrecta' };
    }

    localStorage.setItem(AUTH_KEY, JSON.stringify(foundUser));
    setUser(foundUser);
    setLoading(false);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
  }, []);

  const value: AuthContextValue = {
    user,
    isAuthenticated: user !== null,
    isAdmin: user?.role === 'admin',
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };
