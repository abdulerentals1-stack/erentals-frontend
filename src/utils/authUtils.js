import { useAuth } from '@/context/AuthContext';

export const useAuthStatus = (requireRole = null) => {
  const { user, loading } = useAuth();

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
  };
};
