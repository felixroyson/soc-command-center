import React, { createContext, useContext, useState, useCallback } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_CREDENTIALS = {
  username: 'admin',
  password: 'socx123',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  const login = useCallback((inputUsername: string, inputPassword: string) => {
    if (inputUsername === DEMO_CREDENTIALS.username && inputPassword === DEMO_CREDENTIALS.password) {
      setIsAuthenticated(true);
      setUsername(inputUsername);
      return { success: true };
    }
    return { success: false, error: 'Invalid username or password. Try admin / socx123' };
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUsername(null);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
