/**
 * ProtectedRoute.tsx
 * Route guard — redirects to /access if not authenticated.
 * With ownerOnly=true, also requires isOwner === true.
 *
 * Canon: GAP-CLOSURE-V10-001 · Auth guard
 * @claude | 2026-03-28
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  ownerOnly?: boolean;
}

export default function ProtectedRoute({ children, ownerOnly = false }: ProtectedRouteProps) {
  const { user, loading, isOwner } = useAuth();

  // While auth state is loading, render nothing (avoid flash-redirect)
  if (loading) return null;

  // Not authenticated → redirect to access gate
  if (!user) return <Navigate to="/access" replace />;

  // Owner-only routes
  if (ownerOnly && !isOwner) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
}
