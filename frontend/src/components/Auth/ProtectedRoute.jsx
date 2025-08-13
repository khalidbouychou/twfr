import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

const ProtectedRoute = ({ children, requireAuth = true, redirectTo = '/signin' }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading while checking auth status
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#3CD4AB]"></div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    // Redirect to login with return URL
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (!requireAuth && isAuthenticated) {
    // Redirect to dashboard if trying to access auth pages while logged in
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute; 