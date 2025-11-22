/**
 * Supabase TypeScript Helper Types
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

/**
 * Typed Supabase client
 */
export type TypedSupabaseClient = SupabaseClient<Database>;

/**
 * Helper type for getting table row types
 */
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

/**
 * Helper type for getting table insert types
 */
export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

/**
 * Helper type for getting table update types
 */
export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];
