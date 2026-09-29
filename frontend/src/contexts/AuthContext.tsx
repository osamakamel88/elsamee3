import React, { createContext, useContext, useState, useEffect } from 'react';
import client from '../api/client';

export interface User {
  id: string;
  email: string;
  fullName: string;
  artistType: string;
  country?: string;
  username?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await client.get('/auth/me');
          const normalized: User = {
            id: res.data.id,
            email: res.data.email,
            fullName: res.data.fullName || res.data.full_name || res.data.name || res.data.email,
            artistType: res.data.artistType || res.data.artist_type || 'musician',
            country: res.data.country || 'EG',
            username: res.data.username
          };
          setUser(normalized);
          localStorage.setItem('user', JSON.stringify(normalized));
        } catch (err: any) {
          if (err.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
          }
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = (token: string, userData: any) => {
    localStorage.setItem('token', token);
    const normalized: User = {
      id: userData.id,
      email: userData.email,
      fullName: userData.fullName || userData.full_name || userData.name || userData.email,
      artistType: userData.artistType || userData.artist_type || 'musician',
      country: userData.country || 'EG',
      username: userData.username
    };
    setUser(normalized);
    localStorage.setItem('user', JSON.stringify(normalized));
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
