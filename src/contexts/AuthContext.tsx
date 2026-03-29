import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { hydrateFromSupabase } from "@/lib/artifacts/store";

interface GovernmentProfile {
  id: string;
  full_name: string;
  institution: string;
  country: string;
  position: string;
  department: string | null;
  official_email: string;
  verified: boolean;
  gov_id_type: string | null;
  gov_id_number: string | null;
  gov_id_country: string | null;
  verification_status: string;
}

interface AuthContextType {
  user: User | null;
  profile: GovernmentProfile | null;
  loading: boolean;
  isOwner: boolean;
  signUp: (email: string, password: string, profileData: Omit<GovernmentProfile, "id" | "verified" | "verification_status">) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<GovernmentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  const fetchProfile = async (userId: string) => {
    if (!supabase) return;
    const { data } = await supabase
      .from("government_profiles")
      .select("*")
      .eq("user_id", userId)
      .single();
    if (data) {
      setProfile(data as unknown as GovernmentProfile);
    }
  };

  const checkOwnerRole = async (userId: string) => {
    if (!supabase) return;
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "owner");
    setIsOwner(!!(data && data.length > 0));
  };

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id);
            checkOwnerRole(session.user.id);
            // P0-2: restore artifacts from Supabase on auth state change
            hydrateFromSupabase(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setIsOwner(false);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
        checkOwnerRole(session.user.id);
        // P0-2: hydrate artifacts from Supabase on cold boot restore
        hydrateFromSupabase(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    profileData: Omit<GovernmentProfile, "id" | "verified" | "verification_status">
  ) => {
    if (!supabase) throw new Error("Supabase not configured");
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) throw error;
    if (data.user) {
      const { error: profileError } = await supabase
        .from("government_profiles")
        .insert({
          user_id: data.user.id,
          full_name: profileData.full_name,
          institution: profileData.institution,
          country: profileData.country,
          position: profileData.position,
          department: profileData.department,
          official_email: profileData.official_email,
          gov_id_type: profileData.gov_id_type,
          gov_id_number: profileData.gov_id_number,
          gov_id_country: profileData.gov_id_country,
        });
      if (profileError) throw profileError;

      // Log the registration
      await supabase.from("edit_logs").insert({
        user_id: data.user.id,
        entity_type: "government_profile",
        entity_id: data.user.id,
        action: "registration",
        changes: { institution: profileData.institution, country: profileData.country, gov_id_type: profileData.gov_id_type },
        institution: profileData.institution,
      });
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!supabase) throw new Error("Supabase not configured");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setIsOwner(false);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, isOwner, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
