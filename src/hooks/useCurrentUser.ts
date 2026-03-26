/**
 * useCurrentUser — V6-AUTH-001
 *
 * Single identity surface for all V6 components.
 * Returns structured user data — other V6 features (ProjectDetail, Dashboard,
 * Council, Ruberra) consume this hook instead of useAuth directly.
 *
 * Shape is intentionally flat for easy destructuring.
 */

import { useAuth } from "@/contexts/AuthContext";

export interface CurrentUser {
  id: string;
  email: string;
  displayName: string;    // full_name or email prefix
  institution: string;
  country: string;
  position: string;
  isOwner: boolean;
  isVerified: boolean;
  verificationStatus: string;
}

export function useCurrentUser(): {
  user: CurrentUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
} {
  const { user, profile, isOwner, loading } = useAuth();

  if (!user) {
    return { user: null, isAuthenticated: false, isLoading: loading };
  }

  const displayName =
    profile?.full_name ||
    user.email?.split("@")[0] ||
    "Unknown";

  const currentUser: CurrentUser = {
    id: user.id,
    email: user.email ?? "",
    displayName,
    institution: profile?.institution ?? "",
    country:     profile?.country ?? "",
    position:    profile?.position ?? "",
    isOwner,
    isVerified:        profile?.verified ?? false,
    verificationStatus: profile?.verification_status ?? "pending",
  };

  return { user: currentUser, isAuthenticated: true, isLoading: loading };
}
