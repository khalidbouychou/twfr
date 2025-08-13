import { useContext } from 'react';
import { AuthContext } from './AuthContext';

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};

// Additional utility hooks
export const useAuthStatus = () => {
  const { isAuthenticated, isLoading } = useAuth();
  return { isAuthenticated, isLoading };
};

export const useUserData = () => {
  const { userData, updateUserData, updateUserPreferences } = useAuth();
  return { userData, updateUserData, updateUserPreferences };
};

export const useAuthActions = () => {
  const { login, signup, logout } = useAuth();
  return { login, signup, logout };
}; 