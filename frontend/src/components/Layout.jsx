import React from 'react';
import { Navigate } from 'react-router-dom';


// Dummy authentication check (replace with your real logic)
const isAuthenticated = () => {
  // For now, just check if a token exists in localStorage
  return !!localStorage.getItem('authToken');
};

const Layout = () => {
    return isAuthenticated() ? <Outlet /> : <Navigate to="/signin" replace />;
  };

export default Layout;