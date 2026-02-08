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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          agent_validated_at: string | null
          agent_validated_by: string | null
          commission_decision: string | null
          commission_validated_at: string | null
          commission_validated_by: string | null
          created_at: string
          current_step: string | null
          id: string
          numero_dossier: string | null
          president_validated_at: string | null
          president_validated_by: string | null
          profile_id: string
          rejection_reason: string | null
          status: Database["public"]["Enums"]["application_status"]
          submission_date: string | null
          updated_at: string
          validated_by: string | null
          validation_date: string | null
        }
        Insert: {
          agent_validated_at?: string | null
          agent_validated_by?: string | null
          commission_decision?: string | null
          commission_validated_at?: string | null
          commission_validated_by?: string | null
          created_at?: string
          current_step?: string | null
          id?: string
          numero_dossier?: string | null
          president_validated_at?: string | null
          president_validated_by?: string | null
          profile_id: string
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          submission_date?: string | null
          updated_at?: string
          validated_by?: string | null
          validation_date?: string | null
        }
        Update: {
          agent_validated_at?: string | null
          agent_validated_by?: string | null
          commission_decision?: string | null
          commission_validated_at?: string | null
          commission_validated_by?: string | null
          created_at?: string
          current_step?: string | null
          id?: string
          numero_dossier?: string | null
          president_validated_at?: string | null
          president_validated_by?: string | null
          profile_id?: string
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          submission_date?: string | null
          updated_at?: string
          validated_by?: string | null
          validation_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          document_type: Database["public"]["Enums"]["document_type"]
          file_name: string
          file_size: number | null
          file_url: string
          id: string
          profile_id: string
          uploaded_at: string
        }
        Insert: {
          document_type: Database["public"]["Enums"]["document_type"]
          file_name: string
          file_size?: number | null
          file_url: string
          id?: string
          profile_id: string
          uploaded_at?: string
        }
        Update: {
          document_type?: Database["public"]["Enums"]["document_type"]
          file_name?: string
          file_size?: number | null
          file_url?: string
          id?: string
          profile_id?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          id: string
          is_read: boolean
          message: string
          role: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          role?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          role?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          paid_at: string | null
          payment_method: string | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          payment_type: Database["public"]["Enums"]["payment_type"]
          profile_id: string
          transaction_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          paid_at?: string | null
          payment_method?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          payment_type: Database["public"]["Enums"]["payment_type"]
          profile_id: string
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          paid_at?: string | null
          payment_method?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          payment_type?: Database["public"]["Enums"]["payment_type"]
          profile_id?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          adresse: string
          adresse_cabinet: string | null
          annee_obtention: number
          created_at: string
          date_naissance: string
          diplome: string
          email: string
          etablissement: string | null
          genre: Database["public"]["Enums"]["gender_type"]
          id: string
          lieu_naissance: string
          nationalite: string
          nom: string
          nom_naissance: string | null
          numero_ordre: string | null
          pays_obtention: string
          prenom: string
          province: string
          secteur: Database["public"]["Enums"]["sector_type"]
          sous_specialite: string | null
          specialite: string
          telephone: string
          universite: string
          updated_at: string
          user_id: string
          ville: string
          ville_cabinet: string
        }
        Insert: {
          adresse: string
          adresse_cabinet?: string | null
          annee_obtention: number
          created_at?: string
          date_naissance: string
          diplome: string
          email: string
          etablissement?: string | null
          genre: Database["public"]["Enums"]["gender_type"]
          id?: string
          lieu_naissance: string
          nationalite: string
          nom: string
          nom_naissance?: string | null
          numero_ordre?: string | null
          pays_obtention: string
          prenom: string
          province: string
          secteur: Database["public"]["Enums"]["sector_type"]
          sous_specialite?: string | null
          specialite: string
          telephone: string
          universite: string
          updated_at?: string
          user_id: string
          ville: string
          ville_cabinet: string
        }
        Update: {
          adresse?: string
          adresse_cabinet?: string | null
          annee_obtention?: number
          created_at?: string
          date_naissance?: string
          diplome?: string
          email?: string
          etablissement?: string | null
          genre?: Database["public"]["Enums"]["gender_type"]
          id?: string
          lieu_naissance?: string
          nationalite?: string
          nom?: string
          nom_naissance?: string | null
          numero_ordre?: string | null
          pays_obtention?: string
          prenom?: string
          province?: string
          secteur?: Database["public"]["Enums"]["sector_type"]
          sous_specialite?: string | null
          specialite?: string
          telephone?: string
          universite?: string
          updated_at?: string
          user_id?: string
          ville?: string
          ville_cabinet?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          role: Database["public"]["Enums"]["admin_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["admin_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["admin_role"]
          user_id?: string
        }
        Relationships: []
      }
      workflow_logs: {
        Row: {
          action: string
          application_id: string
          from_step: string | null
          id: string
          metadata: Json | null
          notes: string | null
          performed_at: string
          performed_by: string
          to_step: string | null
        }
        Insert: {
          action: string
          application_id: string
          from_step?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          performed_at?: string
          performed_by: string
          to_step?: string | null
        }
        Update: {
          action?: string
          application_id?: string
          from_step?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          performed_at?: string
          performed_by?: string
          to_step?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_logs_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_dossier_number: { Args: never; Returns: string }
      get_pending_counts: { Args: { user_role: string }; Returns: Json }
      get_profile_id: { Args: { check_user_id: string }; Returns: string }
      is_admin: { Args: { check_user_id: string }; Returns: boolean }
      is_profile_owner: {
        Args: { check_user_id: string; profile_id: string }
        Returns: boolean
      }
    }
    Enums: {
      admin_role: "super_admin" | "approver" | "treasurer"
      application_status:
        | "draft"
        | "submitted"
        | "under_review"
        | "validated"
        | "rejected"
      document_type:
        | "photo_identite_1"
        | "photo_identite_2"
        | "diplome"
        | "casier_judiciaire"
        | "cv"
        | "homologation"
        | "lettre_inscription"
        | "autre"
      gender_type: "M" | "F"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      payment_type: "inscription" | "cotisation_semestrielle" | "autre"
      sector_type: "public" | "prive" | "mixte" | "militaire"
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
      admin_role: ["super_admin", "approver", "treasurer"],
      application_status: [
        "draft",
        "submitted",
        "under_review",
        "validated",
        "rejected",
      ],
      document_type: [
        "photo_identite_1",
        "photo_identite_2",
        "diplome",
        "casier_judiciaire",
        "cv",
        "homologation",
        "lettre_inscription",
        "autre",
      ],
      gender_type: ["M", "F"],
      payment_status: ["pending", "completed", "failed", "refunded"],
      payment_type: ["inscription", "cotisation_semestrielle", "autre"],
      sector_type: ["public", "prive", "mixte", "militaire"],
    },
  },
} as const
