'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { refreshToken, logoutUser } from '@/services/authService';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getNewToken = async () => {
    try {
      const { data } = await refreshToken(); // call refresh token
      setUser(data.user);
      setAccessToken(data.accessToken);
    } catch (err) {
      setUser(null);
      setAccessToken(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    setAccessToken(null);
    router.push('/auth/login');
  };

  useEffect(() => {
    getNewToken(); // runs on app load
  }, []);

  return (
    <AuthContext.Provider value={{ user, accessToken, setAccessToken, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
