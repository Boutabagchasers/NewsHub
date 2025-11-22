/**
 * Supabase Database Types
 * Generated from database schema
 *
 * To regenerate: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/supabase/database.types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          subscription_tier: 'free' | 'pro' | 'enterprise';
          subscription_status: 'active' | 'canceled' | 'past_due' | 'trialing';
          subscription_ends_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          subscription_tier?: 'free' | 'pro' | 'enterprise';
          subscription_status?: 'active' | 'canceled' | 'past_due' | 'trialing';
          subscription_ends_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          subscription_tier?: 'free' | 'pro' | 'enterprise';
          subscription_status?: 'active' | 'canceled' | 'past_due' | 'trialing';
          subscription_ends_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      bookmarks: {
        Row: {
          id: string;
          user_id: string;
          article_url: string;
          article_title: string;
          article_source: string;
          article_category: string;
          article_image_url: string | null;
          article_snippet: string | null;
          article_pub_date: string;
          notes: string | null;
          tags: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          article_url: string;
          article_title: string;
          article_source: string;
          article_category: string;
          article_image_url?: string | null;
          article_snippet?: string | null;
          article_pub_date: string;
          notes?: string | null;
          tags?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          article_url?: string;
          article_title?: string;
          article_source?: string;
          article_category?: string;
          article_image_url?: string | null;
          article_snippet?: string | null;
          article_pub_date?: string;
          notes?: string | null;
          tags?: string[];
          created_at?: string;
        };
      };
      reading_history: {
        Row: {
          id: string;
          user_id: string;
          article_url: string;
          article_title: string;
          article_source: string;
          article_category: string;
          read_duration_seconds: number | null;
          read_percentage: number | null;
          last_read_at: string;
          read_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          article_url: string;
          article_title: string;
          article_source: string;
          article_category: string;
          read_duration_seconds?: number | null;
          read_percentage?: number | null;
          last_read_at?: string;
          read_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          article_url?: string;
          article_title?: string;
          article_source?: string;
          article_category?: string;
          read_duration_seconds?: number | null;
          read_percentage?: number | null;
          last_read_at?: string;
          read_count?: number;
          created_at?: string;
        };
      };
      user_preferences: {
        Row: {
          id: string;
          user_id: string;
          theme: 'light' | 'dark' | 'system';
          favorite_categories: string[];
          blocked_sources: string[];
          notification_settings: Json;
          display_settings: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          theme?: 'light' | 'dark' | 'system';
          favorite_categories?: string[];
          blocked_sources?: string[];
          notification_settings?: Json;
          display_settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          theme?: 'light' | 'dark' | 'system';
          favorite_categories?: string[];
          blocked_sources?: string[];
          notification_settings?: Json;
          display_settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      custom_rss_sources: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          url: string;
          category: string;
          source_name: string;
          is_active: boolean;
          fetch_interval_minutes: number;
          last_fetched_at: string | null;
          fetch_error: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          url: string;
          category: string;
          source_name: string;
          is_active?: boolean;
          fetch_interval_minutes?: number;
          last_fetched_at?: string | null;
          fetch_error?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          url?: string;
          category?: string;
          source_name?: string;
          is_active?: boolean;
          fetch_interval_minutes?: number;
          last_fetched_at?: string | null;
          fetch_error?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      cached_articles: {
        Row: {
          id: string;
          article_url: string;
          title: string;
          link: string;
          pub_date: string;
          content: string | null;
          content_snippet: string | null;
          source: string;
          source_name: string;
          category: string;
          image_url: string | null;
          image_caption: string | null;
          author: string | null;
          cached_at: string;
          expires_at: string;
        };
        Insert: {
          id?: string;
          article_url: string;
          title: string;
          link: string;
          pub_date: string;
          content?: string | null;
          content_snippet?: string | null;
          source: string;
          source_name: string;
          category: string;
          image_url?: string | null;
          image_caption?: string | null;
          author?: string | null;
          cached_at?: string;
          expires_at?: string;
        };
        Update: {
          id?: string;
          article_url?: string;
          title?: string;
          link?: string;
          pub_date?: string;
          content?: string | null;
          content_snippet?: string | null;
          source?: string;
          source_name?: string;
          category?: string;
          image_url?: string | null;
          image_caption?: string | null;
          author?: string | null;
          cached_at?: string;
          expires_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      subscription_tier: 'free' | 'pro' | 'enterprise';
      subscription_status: 'active' | 'canceled' | 'past_due' | 'trialing';
      theme_preference: 'light' | 'dark' | 'system';
    };
  };
}
