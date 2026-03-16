export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          created_at: string | null
          description: string | null
          event_type: string
          id: string
          project_id: string | null
          severity: string
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          event_type?: string
          id?: string
          project_id?: string | null
          severity?: string
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          event_type?: string
          id?: string
          project_id?: string | null
          severity?: string
          title?: string
        }
        Relationships: []
      }
      ai_chat_messages: {
        Row: {
          agent_id: string
          content: string
          created_at: string
          id: string
          project_id: string
          role: string
          user_id: string
        }
        Insert: {
          agent_id: string
          content: string
          created_at?: string
          id?: string
          project_id: string
          role?: string
          user_id: string
        }
        Update: {
          agent_id?: string
          content?: string
          created_at?: string
          id?: string
          project_id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          created_at: string
          id: string
          is_owner_reply: boolean
          message: string
          project_id: string
          sender_country: string | null
          sender_id: string
          sender_institution: string | null
          sender_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_owner_reply?: boolean
          message: string
          project_id: string
          sender_country?: string | null
          sender_id: string
          sender_institution?: string | null
          sender_name: string
        }
        Update: {
          created_at?: string
          id?: string
          is_owner_reply?: boolean
          message?: string
          project_id?: string
          sender_country?: string | null
          sender_id?: string
          sender_institution?: string | null
          sender_name?: string
        }
        Relationships: []
      }
      contribution_votes: {
        Row: {
          contribution_id: string
          created_at: string
          id: string
          user_id: string
          vote_type: string
        }
        Insert: {
          contribution_id: string
          created_at?: string
          id?: string
          user_id: string
          vote_type: string
        }
        Update: {
          contribution_id?: string
          created_at?: string
          id?: string
          user_id?: string
          vote_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "contribution_votes_contribution_id_fkey"
            columns: ["contribution_id"]
            isOneToOne: false
            referencedRelation: "public_contributions"
            referencedColumns: ["id"]
          },
        ]
      }
      document_revisions: {
        Row: {
          author_id: string | null
          author_institution: string | null
          author_name: string
          classification: string
          copyright_holder: string
          copyright_year: number
          created_at: string
          document_name: string
          file_size: number | null
          id: string
          is_current: boolean
          license_type: string
          project_id: string
          revision_notes: string | null
          storage_path: string
          version_number: number
        }
        Insert: {
          author_id?: string | null
          author_institution?: string | null
          author_name: string
          classification?: string
          copyright_holder?: string
          copyright_year?: number
          created_at?: string
          document_name: string
          file_size?: number | null
          id?: string
          is_current?: boolean
          license_type?: string
          project_id: string
          revision_notes?: string | null
          storage_path: string
          version_number?: number
        }
        Update: {
          author_id?: string | null
          author_institution?: string | null
          author_name?: string
          classification?: string
          copyright_holder?: string
          copyright_year?: number
          created_at?: string
          document_name?: string
          file_size?: number | null
          id?: string
          is_current?: boolean
          license_type?: string
          project_id?: string
          revision_notes?: string | null
          storage_path?: string
          version_number?: number
        }
        Relationships: []
      }
      download_logs: {
        Row: {
          country: string | null
          document_name: string
          downloaded_at: string
          id: string
          institution: string | null
          ip_address: string | null
          project_id: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          country?: string | null
          document_name: string
          downloaded_at?: string
          id?: string
          institution?: string | null
          ip_address?: string | null
          project_id: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          country?: string | null
          document_name?: string
          downloaded_at?: string
          id?: string
          institution?: string | null
          ip_address?: string | null
          project_id?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      edit_logs: {
        Row: {
          action: string
          changes: Json | null
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          institution: string | null
          ip_address: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          changes?: Json | null
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          institution?: string | null
          ip_address?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          changes?: Json | null
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          institution?: string | null
          ip_address?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      globe_projects: {
        Row: {
          color: string
          created_at: string
          description: string | null
          id: string
          lat: number
          lon: number
          name: string
          status: string
          user_id: string
        }
        Insert: {
          color?: string
          created_at?: string
          description?: string | null
          id?: string
          lat: number
          lon: number
          name: string
          status?: string
          user_id: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string | null
          id?: string
          lat?: number
          lon?: number
          name?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      government_bids: {
        Row: {
          bid_type: string
          contact_email: string | null
          contact_name: string | null
          country: string | null
          created_at: string
          id: string
          institution: string | null
          message: string
          project_id: string
          status: string
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          bid_type?: string
          contact_email?: string | null
          contact_name?: string | null
          country?: string | null
          created_at?: string
          id?: string
          institution?: string | null
          message: string
          project_id: string
          status?: string
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          bid_type?: string
          contact_email?: string | null
          contact_name?: string | null
          country?: string | null
          created_at?: string
          id?: string
          institution?: string | null
          message?: string
          project_id?: string
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      government_profiles: {
        Row: {
          country: string
          created_at: string
          department: string | null
          full_name: string
          gov_id_country: string | null
          gov_id_number: string | null
          gov_id_type: string | null
          id: string
          institution: string
          official_email: string
          phone: string | null
          position: string
          updated_at: string
          user_id: string
          verification_status: string
          verified: boolean
        }
        Insert: {
          country: string
          created_at?: string
          department?: string | null
          full_name: string
          gov_id_country?: string | null
          gov_id_number?: string | null
          gov_id_type?: string | null
          id?: string
          institution: string
          official_email: string
          phone?: string | null
          position: string
          updated_at?: string
          user_id: string
          verification_status?: string
          verified?: boolean
        }
        Update: {
          country?: string
          created_at?: string
          department?: string | null
          full_name?: string
          gov_id_country?: string | null
          gov_id_number?: string | null
          gov_id_type?: string | null
          id?: string
          institution?: string
          official_email?: string
          phone?: string | null
          position?: string
          updated_at?: string
          user_id?: string
          verification_status?: string
          verified?: boolean
        }
        Relationships: []
      }
      metric_history: {
        Row: {
          id: string
          metric_key: string
          project_id: string
          recorded_at: string
          value: number
        }
        Insert: {
          id?: string
          metric_key: string
          project_id: string
          recorded_at?: string
          value: number
        }
        Update: {
          id?: string
          metric_key?: string
          project_id?: string
          recorded_at?: string
          value?: number
        }
        Relationships: []
      }
      nexus_simulations: {
        Row: {
          agent_results: Json | null
          completed_at: string | null
          created_at: string
          data_snapshot: Json | null
          data_sources: Json | null
          domain: string
          id: string
          integrity_hash: string | null
          prompt: string
          status: string
          unified_analysis: string | null
          user_id: string
        }
        Insert: {
          agent_results?: Json | null
          completed_at?: string | null
          created_at?: string
          data_snapshot?: Json | null
          data_sources?: Json | null
          domain?: string
          id?: string
          integrity_hash?: string | null
          prompt: string
          status?: string
          unified_analysis?: string | null
          user_id: string
        }
        Update: {
          agent_results?: Json | null
          completed_at?: string | null
          created_at?: string
          data_snapshot?: Json | null
          data_sources?: Json | null
          domain?: string
          id?: string
          integrity_hash?: string | null
          prompt?: string
          status?: string
          unified_analysis?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string
          created_at: string
          id: string
          metadata: Json | null
          notification_type: string
          recipient_email: string
          sent_at: string | null
          status: string
          subject: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          metadata?: Json | null
          notification_type: string
          recipient_email: string
          sent_at?: string | null
          status?: string
          subject: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          notification_type?: string
          recipient_email?: string
          sent_at?: string | null
          status?: string
          subject?: string
        }
        Relationships: []
      }
      project_metrics: {
        Row: {
          id: string
          max_value: number | null
          metric_key: string
          metric_value: number
          min_value: number | null
          prev_value: number | null
          project_id: string
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          max_value?: number | null
          metric_key: string
          metric_value: number
          min_value?: number | null
          prev_value?: number | null
          project_id: string
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          max_value?: number | null
          metric_key?: string
          metric_value?: number
          min_value?: number | null
          prev_value?: number | null
          project_id?: string
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      project_notes: {
        Row: {
          content: string
          country: string | null
          created_at: string
          id: string
          institution: string | null
          note_type: string
          project_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          country?: string | null
          created_at?: string
          id?: string
          institution?: string | null
          note_type?: string
          project_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          country?: string | null
          created_at?: string
          id?: string
          institution?: string | null
          note_type?: string
          project_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      project_progress: {
        Row: {
          id: string
          phase: string
          progress: number
          project_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          phase: string
          progress?: number
          project_id: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          phase?: string
          progress?: number
          project_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      public_contributions: {
        Row: {
          author_name: string
          content: string
          created_at: string
          id: string
          project_id: string
          user_id: string
          votes_down: number
          votes_up: number
        }
        Insert: {
          author_name: string
          content: string
          created_at?: string
          id?: string
          project_id: string
          user_id: string
          votes_down?: number
          votes_up?: number
        }
        Update: {
          author_name?: string
          content?: string
          created_at?: string
          id?: string
          project_id?: string
          user_id?: string
          votes_down?: number
          votes_up?: number
        }
        Relationships: []
      }
      system_status: {
        Row: {
          id: string
          last_check: string | null
          latency_ms: number | null
          service_name: string
          status: string
          uptime_pct: number | null
        }
        Insert: {
          id?: string
          last_check?: string | null
          latency_ms?: number | null
          service_name: string
          status?: string
          uptime_pct?: number | null
        }
        Update: {
          id?: string
          last_check?: string | null
          latency_ms?: number | null
          service_name?: string
          status?: string
          uptime_pct?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      metrics_daily_agg: {
        Row: {
          avg_value: number | null
          bucket: string | null
          max_value: number | null
          metric_key: string | null
          min_value: number | null
          project_id: string | null
          sample_count: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      fn_refresh_metrics_daily: { Args: never; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "owner" | "admin" | "government" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["owner", "admin", "government", "user"],
    },
  },
} as const
