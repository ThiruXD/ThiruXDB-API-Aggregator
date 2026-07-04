import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminUser {
  username: string;
  loginTime: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AdminUser | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME,
  password: process.env.ADMIN_PASS,
};

const SESSION_KEY = 'api_dashboard_admin_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      try {
        const parsed: AdminUser = JSON.parse(stored);
        if (Date.now() - parsed.loginTime < SESSION_DURATION) {
          setUser(parsed);
        } else {
          localStorage.removeItem(SESSION_KEY);
        }
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    if (
      username === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password
    ) {
      const adminUser: AdminUser = {
        username,
        loginTime: Date.now(),
      };
      setUser(adminUser);
      localStorage.setItem(SESSION_KEY, JSON.stringify(adminUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!user, user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
