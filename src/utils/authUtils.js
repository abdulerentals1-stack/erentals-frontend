'use client'; // 👈 Important

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';

export const useAuthStatus = (requireRole = null) => {
  const { user, loading } = useAuth();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // only mark ready when client-side renders
    setReady(true);
  }, []);

  const role = user?.role || null;
  const isLoggedIn = !!user;
  const isAdmin = role === 'admin';
  const isCustomer = role === 'customer';

  const isAuthorized = requireRole
    ? role === requireRole
    : isLoggedIn;

  return {
    isLoggedIn,
    isAdmin,
    isCustomer,
    role,
    isAuthorized,
    loading,
    user,
    ready, // 👈 Add this to prevent render flicker
  };
};
