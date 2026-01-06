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
      app_users: {
        Row: {
          artist_id: number | null
          bu_code: Database["public"]["Enums"]["bu_code"] | null
          created_at: string
          email: string | null
          id: string
          name: string
          position: string | null
          role: Database["public"]["Enums"]["erp_role"]
          updated_at: string
        }
        Insert: {
          artist_id?: number | null
          bu_code?: Database["public"]["Enums"]["bu_code"] | null
          created_at?: string
          email?: string | null
          id: string
          name: string
          position?: string | null
          role?: Database["public"]["Enums"]["erp_role"]
          updated_at?: string
        }
        Update: {
          artist_id?: number | null
          bu_code?: Database["public"]["Enums"]["bu_code"] | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          position?: string | null
          role?: Database["public"]["Enums"]["erp_role"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_app_users_artist_id"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      artists: {
        Row: {
          bu_code: Database["public"]["Enums"]["bu_code"]
          contract_end: string
          contract_start: string
          created_at: string
          id: number
          name: string
          nationality: string | null
          role: string | null
          status: string
          team_id: number | null
          type: string
          updated_at: string
          visa_end: string | null
          visa_start: string | null
          visa_type: string | null
        }
        Insert: {
          bu_code: Database["public"]["Enums"]["bu_code"]
          contract_end: string
          contract_start: string
          created_at?: string
          id?: number
          name: string
          nationality?: string | null
          role?: string | null
          status?: string
          team_id?: number | null
          type?: string
          updated_at?: string
          visa_end?: string | null
          visa_start?: string | null
          visa_type?: string | null
        }
        Update: {
          bu_code?: Database["public"]["Enums"]["bu_code"]
          contract_end?: string
          contract_start?: string
          created_at?: string
          id?: number
          name?: string
          nationality?: string | null
          role?: string | null
          status?: string
          team_id?: number | null
          type?: string
          updated_at?: string
          visa_end?: string | null
          visa_start?: string | null
          visa_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "artists_bu_code_fkey"
            columns: ["bu_code"]
            isOneToOne: false
            referencedRelation: "business_units"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "artists_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      business_units: {
        Row: {
          code: Database["public"]["Enums"]["bu_code"]
          created_at: string
          id: number
          name: string
        }
        Insert: {
          code: Database["public"]["Enums"]["bu_code"]
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          code?: Database["public"]["Enums"]["bu_code"]
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      channel_contents: {
        Row: {
          assignee_id: string | null
          assignee_name: string | null
          channel_id: number
          created_at: string
          id: number
          stage: Database["public"]["Enums"]["content_stage"]
          title: string
          updated_at: string
          upload_date: string
        }
        Insert: {
          assignee_id?: string | null
          assignee_name?: string | null
          channel_id: number
          created_at?: string
          id?: number
          stage?: Database["public"]["Enums"]["content_stage"]
          title: string
          updated_at?: string
          upload_date: string
        }
        Update: {
          assignee_id?: string | null
          assignee_name?: string | null
          channel_id?: number
          created_at?: string
          id?: number
          stage?: Database["public"]["Enums"]["content_stage"]
          title?: string
          updated_at?: string
          upload_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "channel_contents_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "channel_contents_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
        ]
      }
      channels: {
        Row: {
          ad_status: string | null
          bu_code: Database["public"]["Enums"]["bu_code"]
          created_at: string
          id: number
          manager_id: string | null
          manager_name: string | null
          name: string
          next_upload_date: string | null
          production_company: string | null
          recent_video: string | null
          status: Database["public"]["Enums"]["channel_status"]
          subscribers_count: string | null
          total_views: string | null
          updated_at: string
          upload_days: string[] | null
          url: string | null
        }
        Insert: {
          ad_status?: string | null
          bu_code: Database["public"]["Enums"]["bu_code"]
          created_at?: string
          id?: number
          manager_id?: string | null
          manager_name?: string | null
          name: string
          next_upload_date?: string | null
          production_company?: string | null
          recent_video?: string | null
          status?: Database["public"]["Enums"]["channel_status"]
          subscribers_count?: string | null
          total_views?: string | null
          updated_at?: string
          upload_days?: string[] | null
          url?: string | null
        }
        Update: {
          ad_status?: string | null
          bu_code?: Database["public"]["Enums"]["bu_code"]
          created_at?: string
          id?: number
          manager_id?: string | null
          manager_name?: string | null
          name?: string
          next_upload_date?: string | null
          production_company?: string | null
          recent_video?: string | null
          status?: Database["public"]["Enums"]["channel_status"]
          subscribers_count?: string | null
          total_views?: string | null
          updated_at?: string
          upload_days?: string[] | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "channels_bu_code_fkey"
            columns: ["bu_code"]
            isOneToOne: false
            referencedRelation: "business_units"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "channels_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
        ]
      }
      comment_mentions_reads: {
        Row: {
          comment_id: number
          id: number
          read_at: string
          user_id: string
        }
        Insert: {
          comment_id: number
          id?: number
          read_at?: string
          user_id: string
        }
        Update: {
          comment_id?: number
          id?: number
          read_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_mentions_reads_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_mentions_reads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          author_id: string
          author_name: string
          content: string
          created_at: string
          entity_id: number
          entity_type: string
          mentioned_user_ids: Json | null
          id: number
          updated_at: string
        }
        Insert: {
          author_id: string
          author_name: string
          content: string
          created_at?: string
          entity_id: number
          entity_type: string
          mentioned_user_ids?: Json | null
          id?: number
          updated_at?: string
        }
        Update: {
          author_id?: string
          author_name?: string
          content?: string
          created_at?: string
          entity_id?: number
          entity_type?: string
          mentioned_user_ids?: Json | null
          id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
        ]
      }
      creators: {
        Row: {
          agency: string | null
          bu_code: Database["public"]["Enums"]["bu_code"]
          channel_id: number | null
          contact_person: string | null
          created_at: string
          created_by: string | null
          email: string | null
          engagement_rate: string | null
          fee_range: string | null
          id: number
          name: string
          notes: string | null
          phone: string | null
          platform: string | null
          specialties: string[] | null
          status: string
          subscribers_count: string | null
          type: string
          updated_at: string
        }
        Insert: {
          agency?: string | null
          bu_code: Database["public"]["Enums"]["bu_code"]
          channel_id?: number | null
          contact_person?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          engagement_rate?: string | null
          fee_range?: string | null
          id?: number
          name: string
          notes?: string | null
          phone?: string | null
          platform?: string | null
          specialties?: string[] | null
          status?: string
          subscribers_count?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          agency?: string | null
          bu_code?: Database["public"]["Enums"]["bu_code"]
          channel_id?: number | null
          contact_person?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          engagement_rate?: string | null
          fee_range?: string | null
          id?: number
          name?: string
          notes?: string | null
          phone?: string | null
          platform?: string | null
          specialties?: string[] | null
          status?: string
          subscribers_count?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "creators_bu_code_fkey"
            columns: ["bu_code"]
            isOneToOne: false
            referencedRelation: "business_units"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "creators_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creators_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
        ]
      }
      dancers: {
        Row: {
          account_number: string | null
          bank_copy: string | null
          bank_name: string | null
          bu_code: Database["public"]["Enums"]["bu_code"]
          company: string | null
          contact: string | null
          created_at: string
          gender: string | null
          id: number
          id_document_file: string | null
          id_document_type: string | null
          name: string
          nationality: string | null
          nickname_en: string | null
          nickname_ko: string | null
          note: string | null
          photo: string | null
          real_name: string | null
          team_name: string | null
          updated_at: string
        }
        Insert: {
          account_number?: string | null
          bank_copy?: string | null
          bank_name?: string | null
          bu_code: Database["public"]["Enums"]["bu_code"]
          company?: string | null
          contact?: string | null
          created_at?: string
          gender?: string | null
          id?: number
          id_document_file?: string | null
          id_document_type?: string | null
          name: string
          nationality?: string | null
          nickname_en?: string | null
          nickname_ko?: string | null
          note?: string | null
          photo?: string | null
          real_name?: string | null
          team_name?: string | null
          updated_at?: string
        }
        Update: {
          account_number?: string | null
          bank_copy?: string | null
          bank_name?: string | null
          bu_code?: Database["public"]["Enums"]["bu_code"]
          company?: string | null
          contact?: string | null
          created_at?: string
          gender?: string | null
          id?: number
          id_document_file?: string | null
          id_document_type?: string | null
          name?: string
          nationality?: string | null
          nickname_en?: string | null
          nickname_ko?: string | null
          note?: string | null
          photo?: string | null
          real_name?: string | null
          team_name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "external_dancers_bu_code_fkey"
            columns: ["bu_code"]
            isOneToOne: false
            referencedRelation: "business_units"
            referencedColumns: ["code"]
          },
        ]
      }
      equipment: {
        Row: {
          borrower_id: string | null
          borrower_name: string | null
          bu_code: Database["public"]["Enums"]["bu_code"]
          category: string
          created_at: string
          id: number
          location: string | null
          name: string
          notes: string | null
          return_date: string | null
          serial_number: string | null
          status: Database["public"]["Enums"]["equipment_status"]
          updated_at: string
        }
        Insert: {
          borrower_id?: string | null
          borrower_name?: string | null
          bu_code: Database["public"]["Enums"]["bu_code"]
          category: string
          created_at?: string
          id?: number
          location?: string | null
          name: string
          notes?: string | null
          return_date?: string | null
          serial_number?: string | null
          status?: Database["public"]["Enums"]["equipment_status"]
          updated_at?: string
        }
        Update: {
          borrower_id?: string | null
          borrower_name?: string | null
          bu_code?: Database["public"]["Enums"]["bu_code"]
          category?: string
          created_at?: string
          id?: number
          location?: string | null
          name?: string
          notes?: string | null
          return_date?: string | null
          serial_number?: string | null
          status?: Database["public"]["Enums"]["equipment_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "equipment_borrower_id_fkey"
            columns: ["borrower_id"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_bu_code_fkey"
            columns: ["bu_code"]
            isOneToOne: false
            referencedRelation: "business_units"
            referencedColumns: ["code"]
          },
        ]
      }
      financial_entries: {
        Row: {
          actual_amount: number | null
          amount: number
          bu_code: Database["public"]["Enums"]["bu_code"]
          category: string
          created_at: string
          created_by: string | null
          id: number
          kind: Database["public"]["Enums"]["financial_kind"]
          memo: string | null
          name: string
          occurred_at: string
          partner_company_id: number | null
          partner_worker_id: number | null
          payment_method: Database["public"]["Enums"]["payment_method"] | null
          project_id: number
          status: Database["public"]["Enums"]["financial_status"]
          updated_at: string
        }
        Insert: {
          actual_amount?: number | null
          amount: number
          bu_code: Database["public"]["Enums"]["bu_code"]
          category: string
          created_at?: string
          created_by?: string | null
          id?: number
          kind: Database["public"]["Enums"]["financial_kind"]
          memo?: string | null
          name: string
          occurred_at: string
          partner_company_id?: number | null
          partner_worker_id?: number | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          project_id: number
          status?: Database["public"]["Enums"]["financial_status"]
          updated_at?: string
        }
        Update: {
          actual_amount?: number | null
          amount?: number
          bu_code?: Database["public"]["Enums"]["bu_code"]
          category?: string
          created_at?: string
          created_by?: string | null
          id?: number
          kind?: Database["public"]["Enums"]["financial_kind"]
          memo?: string | null
          name?: string
          occurred_at?: string
          partner_company_id?: number | null
          partner_worker_id?: number | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          project_id?: number
          status?: Database["public"]["Enums"]["financial_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_entries_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_entries_partner_company_id_fkey"
            columns: ["partner_company_id"]
            isOneToOne: false
            referencedRelation: "partner_company"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_entries_partner_worker_id_fkey"
            columns: ["partner_worker_id"]
            isOneToOne: false
            referencedRelation: "partner_worker"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_entries_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      manuals: {
        Row: {
          author_id: string | null
          author_name: string | null
          bu_code: Database["public"]["Enums"]["bu_code"]
          category: string
          content: Json
          created_at: string
          id: number
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          author_name?: string | null
          bu_code: Database["public"]["Enums"]["bu_code"]
          category: string
          content?: Json
          created_at?: string
          id?: number
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          author_name?: string | null
          bu_code?: Database["public"]["Enums"]["bu_code"]
          category?: string
          content?: Json
          created_at?: string
          id?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "manuals_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "manuals_bu_code_fkey"
            columns: ["bu_code"]
            isOneToOne: false
            referencedRelation: "business_units"
            referencedColumns: ["code"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: number
          message: string
          read: boolean | null
          title: string
          type: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          message: string
          read?: boolean | null
          title: string
          type?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          message?: string
          read?: boolean | null
          title?: string
          type?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      org_units: {
        Row: {
          created_at: string
          id: number
          name: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      partner_company: {
        Row: {
          bu_code: Database["public"]["Enums"]["bu_code"]
          business_registration_file: string | null
          business_registration_number: string | null
          company_name_en: string | null
          company_name_ko: string | null
          created_at: string
          id: number
          industry: string | null
          last_meeting_date: string | null
          partner_type: string
          representative_name: string | null
          status: Database["public"]["Enums"]["client_status"]
          updated_at: string
        }
        Insert: {
          bu_code: Database["public"]["Enums"]["bu_code"]
          business_registration_file?: string | null
          business_registration_number?: string | null
          company_name_en?: string | null
          company_name_ko?: string | null
          created_at?: string
          id?: number
          industry?: string | null
          last_meeting_date?: string | null
          partner_type?: string
          representative_name?: string | null
          status?: Database["public"]["Enums"]["client_status"]
          updated_at?: string
        }
        Update: {
          bu_code?: Database["public"]["Enums"]["bu_code"]
          business_registration_file?: string | null
          business_registration_number?: string | null
          company_name_en?: string | null
          company_name_ko?: string | null
          created_at?: string
          id?: number
          industry?: string | null
          last_meeting_date?: string | null
          partner_type?: string
          representative_name?: string | null
          status?: Database["public"]["Enums"]["client_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_company_bu_code_fkey"
            columns: ["bu_code"]
            isOneToOne: false
            referencedRelation: "business_units"
            referencedColumns: ["code"]
          },
        ]
      }
      partner_worker: {
        Row: {
          bu_code: Database["public"]["Enums"]["bu_code"]
          business_card_file: string | null
          created_at: string
          email: string | null
          id: number
          is_active: boolean
          name: string | null
          name_en: string | null
          name_ko: string | null
          notes: string | null
          partner_company_id: number | null
          phone: string | null
          specialties: string[] | null
          updated_at: string
          worker_type: string
        }
        Insert: {
          bu_code: Database["public"]["Enums"]["bu_code"]
          business_card_file?: string | null
          created_at?: string
          email?: string | null
          id?: number
          is_active?: boolean
          name?: string | null
          name_en?: string | null
          name_ko?: string | null
          notes?: string | null
          partner_company_id?: number | null
          phone?: string | null
          specialties?: string[] | null
          updated_at?: string
          worker_type?: string
        }
        Update: {
          bu_code?: Database["public"]["Enums"]["bu_code"]
          business_card_file?: string | null
          created_at?: string
          email?: string | null
          id?: number
          is_active?: boolean
          name?: string | null
          name_en?: string | null
          name_ko?: string | null
          notes?: string | null
          partner_company_id?: number | null
          phone?: string | null
          specialties?: string[] | null
          updated_at?: string
          worker_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_worker_bu_code_fkey"
            columns: ["bu_code"]
            isOneToOne: false
            referencedRelation: "business_units"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "partner_worker_partner_company_id_fkey"
            columns: ["partner_company_id"]
            isOneToOne: false
            referencedRelation: "partner_company"
            referencedColumns: ["id"]
          },
        ]
      }
      project_tasks: {
        Row: {
          assignee: string | null
          assignee_id: string | null
          bu_code: Database["public"]["Enums"]["bu_code"]
          created_at: string
          created_by: string | null
          due_date: string
          id: number
          priority: string | null
          project_id: number
          status: Database["public"]["Enums"]["task_status"]
          tag: string | null
          title: string
          updated_at: string
        }
        Insert: {
          assignee?: string | null
          assignee_id?: string | null
          bu_code: Database["public"]["Enums"]["bu_code"]
          created_at?: string
          created_by?: string | null
          due_date: string
          id?: number
          priority?: string | null
          project_id: number
          status?: Database["public"]["Enums"]["task_status"]
          tag?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          assignee?: string | null
          assignee_id?: string | null
          bu_code?: Database["public"]["Enums"]["bu_code"]
          created_at?: string
          created_by?: string | null
          due_date?: string
          id?: number
          priority?: string | null
          project_id?: number
          status?: Database["public"]["Enums"]["task_status"]
          tag?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_tasks_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          active_steps: Json | null
          artist_id: number | null
          assets: Json | null
          bu_code: Database["public"]["Enums"]["bu_code"]
          category: string
          channel_id: number | null
          client_id: number | null
          created_at: string
          created_by: string | null
          creators: Json | null
          description: string | null
          edit_final_date: string | null
          edit1_date: string | null
          end_date: string | null
          freelancers: Json | null
          id: number
          name: string
          participants: Json | null
          plan_date: string | null
          pm_ids: Json | null
          pm_name: string | null
          release_date: string | null
          script_date: string | null
          shoot_date: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"]
          updated_at: string
        }
        Insert: {
          active_steps?: Json | null
          artist_id?: number | null
          assets?: Json | null
          bu_code: Database["public"]["Enums"]["bu_code"]
          category: string
          channel_id?: number | null
          client_id?: number | null
          created_at?: string
          created_by?: string | null
          creators?: Json | null
          description?: string | null
          edit_final_date?: string | null
          edit1_date?: string | null
          end_date?: string | null
          freelancers?: Json | null
          id?: number
          name: string
          participants?: Json | null
          plan_date?: string | null
          pm_ids?: Json | null
          pm_name?: string | null
          release_date?: string | null
          script_date?: string | null
          shoot_date?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          updated_at?: string
        }
        Update: {
          active_steps?: Json | null
          artist_id?: number | null
          assets?: Json | null
          bu_code?: Database["public"]["Enums"]["bu_code"]
          category?: string
          channel_id?: number | null
          client_id?: number | null
          created_at?: string
          created_by?: string | null
          creators?: Json | null
          description?: string | null
          edit_final_date?: string | null
          edit1_date?: string | null
          end_date?: string | null
          freelancers?: Json | null
          id?: number
          name?: string
          participants?: Json | null
          plan_date?: string | null
          pm_ids?: Json | null
          pm_name?: string | null
          release_date?: string | null
          script_date?: string | null
          shoot_date?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_projects_partner_company_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "partner_company"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_bu_code_fkey"
            columns: ["bu_code"]
            isOneToOne: false
            referencedRelation: "business_units"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "projects_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      bu_code: "GRIGO" | "FLOW" | "REACT" | "MODOO" | "AST" | "HEAD"
      channel_status: "active" | "growing" | "inactive" | "archived"
      client_status: "active" | "inactive" | "archived"
      content_stage: "planning" | "shooting" | "editing" | "uploaded"
      equipment_status: "available" | "rented" | "maintenance" | "lost"
      erp_role: "admin" | "manager" | "member" | "viewer" | "artist"
      event_type: "meeting" | "shoot" | "deadline" | "holiday" | "event"
      financial_kind: "revenue" | "expense"
      financial_status: "planned" | "paid" | "canceled"
      payment_method:
        | "vat_included"
        | "tax_free"
        | "withholding"
        | "actual_payment"
      project_status: "준비중" | "진행중" | "운영중" | "기획중" | "완료"
      task_status: "todo" | "in_progress" | "done"
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
      bu_code: ["GRIGO", "FLOW", "REACT", "MODOO", "AST", "HEAD"],
      channel_status: ["active", "growing", "inactive", "archived"],
      client_status: ["active", "inactive", "archived"],
      content_stage: ["planning", "shooting", "editing", "uploaded"],
      equipment_status: ["available", "rented", "maintenance", "lost"],
      erp_role: ["admin", "manager", "member", "viewer", "artist"],
      event_type: ["meeting", "shoot", "deadline", "holiday", "event"],
      financial_kind: ["revenue", "expense"],
      financial_status: ["planned", "paid", "canceled"],
      payment_method: [
        "vat_included",
        "tax_free",
        "withholding",
        "actual_payment",
      ],
      project_status: ["준비중", "진행중", "운영중", "기획중", "완료"],
      task_status: ["todo", "in_progress", "done"],
    },
  },
} as const

