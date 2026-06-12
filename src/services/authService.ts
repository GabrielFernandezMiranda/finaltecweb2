import type { User, LoginCredentials } from '../interfaces/auth';

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

function authenticateUser(
  credentials: LoginCredentials
): { success: boolean; user?: User; error?: string } {
  const foundUser = PREDEFINED_USERS.find(
    (u) => u.username === credentials.username
  );

  if (!foundUser) {
    return { success: false, error: 'Usuario no encontrado' };
  }

  if (PASSWORDS[credentials.username] !== credentials.password) {
    return { success: false, error: 'Contraseña incorrecta' };
  }

  localStorage.setItem(AUTH_KEY, JSON.stringify(foundUser));
  return { success: true, user: foundUser };
}

function getStoredUser(): User | null {
  const stored = localStorage.getItem(AUTH_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as User;
    } catch {
      localStorage.removeItem(AUTH_KEY);
    }
  }
  return null;
}

function clearSession(): void {
  localStorage.removeItem(AUTH_KEY);
}

export { authenticateUser, getStoredUser, clearSession };
