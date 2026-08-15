import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const HOME_BY_ROLE = {
  admin: '/admin',
  normal: '/stores',
  store_owner: '/store-owner',
};

// Wrap any page that requires login. Optionally restrict to specific roles:
// <ProtectedRoute roles={['admin']}><AdminPage /></ProtectedRoute>
export default function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={HOME_BY_ROLE[user.role] || '/'} replace />;
  }

  return children;
}
