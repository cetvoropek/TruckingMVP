export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          role: 'driver' | 'recruiter' | 'admin'
          profile_image: string | null
          phone: string | null
          location: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          role: 'driver' | 'recruiter' | 'admin'
          profile_image?: string | null
          phone?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'driver' | 'recruiter' | 'admin'
          profile_image?: string | null
          phone?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      drivers: {
        Row: {
          id: string
          experience_years: number
          license_types: string[]
          twic_card: boolean
          hazmat_endorsement: boolean
          availability: 'available' | 'employed' | 'seeking'
          preferred_routes: string[]
          equipment_experience: string[]
          fit_score: number
          profile_completion: number
          documents_verified: boolean
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          experience_years?: number
          license_types?: string[]
          twic_card?: boolean
          hazmat_endorsement?: boolean
          availability?: 'available' | 'employed' | 'seeking'
          preferred_routes?: string[]
          equipment_experience?: string[]
          fit_score?: number
          profile_completion?: number
          documents_verified?: boolean
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          experience_years?: number
          license_types?: string[]
          twic_card?: boolean
          hazmat_endorsement?: boolean
          availability?: 'available' | 'employed' | 'seeking'
          preferred_routes?: string[]
          equipment_experience?: string[]
          fit_score?: number
          profile_completion?: number
          documents_verified?: boolean
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      recruiters: {
        Row: {
          id: string
          company_name: string
          company_size: string | null
          website: string | null
          contacts_unlocked: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          company_name: string
          company_size?: string | null
          website?: string | null
          contacts_unlocked?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_name?: string
          company_size?: string | null
          website?: string | null
          contacts_unlocked?: number
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          recruiter_id: string
          type: 'starter' | 'pro' | 'enterprise' | 'pay-per-contact'
          status: 'active' | 'cancelled' | 'expired' | 'trial'
          contacts_limit: number | null
          contacts_used: number
          price_monthly: number | null
          current_period_start: string
          current_period_end: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          recruiter_id: string
          type: 'starter' | 'pro' | 'enterprise' | 'pay-per-contact'
          status: 'active' | 'cancelled' | 'expired' | 'trial'
          contacts_limit?: number | null
          contacts_used?: number
          price_monthly?: number | null
          current_period_start?: string
          current_period_end?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          recruiter_id?: string
          type?: 'starter' | 'pro' | 'enterprise' | 'pay-per-contact'
          status?: 'active' | 'cancelled' | 'expired' | 'trial'
          contacts_limit?: number | null
          contacts_used?: number
          price_monthly?: number | null
          current_period_start?: string
          current_period_end?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      applications: {
        Row: {
          id: string
          driver_id: string
          job_id: string
          recruiter_id: string
          status: 'pending' | 'reviewed' | 'interviewed' | 'hired' | 'rejected'
          cover_letter: string | null
          notes: string | null
          applied_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          driver_id: string
          job_id: string
          recruiter_id: string
          status?: 'pending' | 'reviewed' | 'interviewed' | 'hired' | 'rejected'
          cover_letter?: string | null
          notes?: string | null
          applied_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          driver_id?: string
          job_id?: string
          recruiter_id?: string
          status?: 'pending' | 'reviewed' | 'interviewed' | 'hired' | 'rejected'
          cover_letter?: string | null
          notes?: string | null
          applied_at?: string
          updated_at?: string
        }
      }
      job_postings: {
        Row: {
          id: string
          recruiter_id: string
          title: string
          description: string
          location: string
          job_type: string
          salary_min: number | null
          salary_max: number | null
          requirements: string[]
          benefits: string[]
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          recruiter_id: string
          title: string
          description: string
          location: string
          job_type: string
          salary_min?: number | null
          salary_max?: number | null
          requirements?: string[]
          benefits?: string[]
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          recruiter_id?: string
          title?: string
          description?: string
          location?: string
          job_type?: string
          salary_min?: number | null
          salary_max?: number | null
          requirements?: string[]
          benefits?: string[]
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          recipient_id: string
          application_id: string | null
          content: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          recipient_id: string
          application_id?: string | null
          content: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          recipient_id?: string
          application_id?: string | null
          content?: string
          read?: boolean
          created_at?: string
        }
      }
      interviews: {
        Row: {
          id: string
          recruiter_id: string
          driver_id: string
          application_id: string | null
          title: string
          description: string | null
          scheduled_at: string
          duration_minutes: number
          type: 'phone' | 'video' | 'in-person'
          status: 'scheduled' | 'completed' | 'cancelled' | 'no-show'
          meeting_url: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          recruiter_id: string
          driver_id: string
          application_id?: string | null
          title: string
          description?: string | null
          scheduled_at: string
          duration_minutes?: number
          type: 'phone' | 'video' | 'in-person'
          status?: 'scheduled' | 'completed' | 'cancelled' | 'no-show'
          meeting_url?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          recruiter_id?: string
          driver_id?: string
          application_id?: string | null
          title?: string
          description?: string | null
          scheduled_at?: string
          duration_minutes?: number
          type?: 'phone' | 'video' | 'in-person'
          status?: 'scheduled' | 'completed' | 'cancelled' | 'no-show'
          meeting_url?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      contact_unlocks: {
        Row: {
          id: string
          recruiter_id: string
          driver_id: string
          unlocked_at: string
        }
        Insert: {
          id?: string
          recruiter_id: string
          driver_id: string
          unlocked_at?: string
        }
        Update: {
          id?: string
          recruiter_id?: string
          driver_id?: string
          unlocked_at?: string
        }
      }
      analytics_events: {
        Row: {
          id: string
          user_id: string
          event_type: string
          event_data: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          event_type: string
          event_data?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          event_type?: string
          event_data?: Json
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'driver' | 'recruiter' | 'admin'
      availability_status: 'available' | 'employed' | 'seeking'
      application_status: 'pending' | 'reviewed' | 'interviewed' | 'hired' | 'rejected'
      interview_type: 'phone' | 'video' | 'in-person'
      interview_status: 'scheduled' | 'completed' | 'cancelled' | 'no-show'
      document_type: 'license' | 'medical' | 'twic' | 'hazmat' | 'cv' | 'other'
      subscription_type: 'starter' | 'pro' | 'enterprise' | 'pay-per-contact'
      subscription_status: 'active' | 'cancelled' | 'expired' | 'trial'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}