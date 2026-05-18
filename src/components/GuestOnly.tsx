import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { getPostAuthEntryPath } from '@/lib/authRouting';
import { useAuthStore } from '@/store/auth.store';

type Props = {
  children: ReactNode;
};

const GuestOnly = ({ children }: Props) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (isAuthenticated) {
    return <Navigate to={getPostAuthEntryPath(user)} replace />;
  }

  return <>{children}</>;
};

export default GuestOnly;

