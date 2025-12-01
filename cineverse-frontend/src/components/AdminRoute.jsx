import React from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { Navigate } from 'react-router-dom';

export default function AdminRoute({ children }) {
  const { isAdmin } = useAdminAuth();
  if (!isAdmin) return <Navigate to="/admin/login" replace />;
  return children;
}
