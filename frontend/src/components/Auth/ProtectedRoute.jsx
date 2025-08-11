import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { isAuthenticated } = useAuth();

  if (requireAuth && !isAuthenticated) {
    // Redirect to login if trying to access protected route without auth
    return <Navigate to="/signin" replace />;
  }

  if (!requireAuth && isAuthenticated) {
    // Redirect to home if trying to access auth pages while already logged in
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute; 