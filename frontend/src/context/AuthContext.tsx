import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthResponse } from '../types/index';
import { authAPI } from '../services/api';

interface AuthContextType {
  user: AuthResponse | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { nom: string; prenom: string; email: string; motDePasse: string; role?: string }) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await authAPI.getMe();
          setUser(res.data);
        } catch {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await authAPI.login({ email, motDePasse: password });
    const userData: AuthResponse = res.data;
    setUser(userData);
    setToken(userData.token);
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const register = async (data: { nom: string; prenom: string; email: string; motDePasse: string; role?: string }) => {
    const res = await authAPI.register(data);
    const userData: AuthResponse = res.data;
    setUser(userData);
    setToken(userData.token);
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};
