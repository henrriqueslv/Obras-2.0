import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingPage } from '@/components/ui/LoadingSpinner';

export const ProtectedRoute = ({ children, requiredUserType = null }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingPage message="Verificando autenticação..." />;
  }

  if (!isAuthenticated) {
    // Redirecionar para login, salvando a localização atual
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredUserType && user?.user_type !== requiredUserType) {
    // Redirecionar para dashboard se o tipo de usuário não corresponder
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

