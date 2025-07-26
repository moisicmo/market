import { useEffect, type ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useAuthStore } from '@/hooks';


export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { status, checkAuthToken } = useAuthStore();

  useEffect(() => {
    checkAuthToken();
  }, []);

  if (status === 'checking') return <p>Cargando...</p>;
  if (status === 'not-authenticated') return <Navigate to="/login" replace />;

  return <>{children}</>;
};