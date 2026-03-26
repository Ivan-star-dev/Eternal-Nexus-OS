/**
 * ProtectedRoute — V6-AUTH-001
 *
 * Wraps any route that requires an authenticated session.
 * - Unauthenticated → redirect to /access, preserving `from` in location state
 * - Loading → renders nothing (AuthContext resolves on mount)
 * - Owner-only routes → requires isOwner === true, else redirect to /dashboard
 */

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** If true, user must also have isOwner === true */
  ownerOnly?: boolean;
}

export default function ProtectedRoute({ children, ownerOnly = false }: ProtectedRouteProps) {
  const { user, isOwner, loading } = useAuth();
  const location = useLocation();

  // AuthContext is still resolving session — render nothing to avoid flash
  if (loading) return null;

  // Not authenticated → send to /access, preserve intended destination
  if (!user) {
    return <Navigate to="/access" state={{ from: location }} replace />;
  }

  // Authenticated but not owner when ownerOnly required
  if (ownerOnly && !isOwner) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
