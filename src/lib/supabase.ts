import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      question_progress: {
        Row: {
          question_id: string
          user_id: string
          rehearsed: boolean
          confidence: number
          user_notes: string
          updated_at: string
        }
        Insert: {
          question_id: string
          user_id: string
          rehearsed?: boolean
          confidence?: number
          user_notes?: string
          updated_at?: string
        }
        Update: {
          rehearsed?: boolean
          confidence?: number
          user_notes?: string
          updated_at?: string
        }
      }
    }
  }
}
