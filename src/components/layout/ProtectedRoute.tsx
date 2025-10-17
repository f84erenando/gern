import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute: React.FC<{ adminOnly?: boolean }> = ({ adminOnly = false }) => {
  const { session, isAdmin } = useAuth();

  // FIX: Removed the redundant loading check.
  // The AuthProvider now handles the initial loading state for the entire app.
  if (!session) {
    return <Navigate to="/" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
