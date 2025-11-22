/**
 * Reading History Database Utilities
 * Track and retrieve user reading history
 */

import type { TypedSupabaseClient } from '../supabase/types';
import type { Database } from '../supabase/database.types';

type ReadingHistory = Database['public']['Tables']['reading_history']['Row'];
type ReadingHistoryInsert = Database['public']['Tables']['reading_history']['Insert'];

/**
 * Get reading history for a user
 */
export async function getReadingHistory(
  supabase: TypedSupabaseClient,
  userId: string,
  options?: {
    category?: string;
    limit?: number;
    offset?: number;
  }
) {
  let query = supabase
    .from('reading_history')
    .select('*')
    .eq('user_id', userId)
    .order('last_read_at', { ascending: false });

  // Filter by category
  if (options?.category) {
    query = query.eq('article_category', options.category);
  }

  // Pagination
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options?.limit || 10) - 1);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching reading history:', error);
    return { history: [], error };
  }

  return { history: data as ReadingHistory[], error: null };
}

/**
 * Record article read event
 * Creates new entry or updates existing one
 */
export async function recordArticleRead(
  supabase: TypedSupabaseClient,
  articleData: ReadingHistoryInsert
) {
  // Check if entry exists
  const { data: existing } = await supabase
    .from('reading_history')
    .select('id, read_count')
    .eq('user_id', articleData.user_id)
    .eq('article_url', articleData.article_url)
    .maybeSingle();

  if (existing) {
    // Update existing entry
    const { data, error } = await supabase
      .from('reading_history')
      .update({
        last_read_at: new Date().toISOString(),
        read_count: (existing as { id: string; read_count: number }).read_count + 1,
        read_duration_seconds: articleData.read_duration_seconds,
        read_percentage: articleData.read_percentage,
      } as never)
      .eq('id', (existing as { id: string; read_count: number }).id)
      .select()
      .single();

    if (error) {
      console.error('Error updating reading history:', error);
      return { history: null, error };
    }

    return { history: data as ReadingHistory, error: null };
  } else {
    // Create new entry
    const { data, error } = await supabase
      .from('reading_history')
      .insert(articleData as never)
      .select()
      .single();

    if (error) {
      console.error('Error creating reading history:', error);
      return { history: null, error };
    }

    return { history: data as ReadingHistory, error: null };
  }
}

/**
 * Check if article has been read
 */
export async function hasReadArticle(
  supabase: TypedSupabaseClient,
  userId: string,
  articleUrl: string
) {
  const { data, error } = await supabase
    .from('reading_history')
    .select('id, read_count')
    .eq('user_id', userId)
    .eq('article_url', articleUrl)
    .maybeSingle();

  if (error) {
    console.error('Error checking reading history:', error);
    return { hasRead: false, readCount: 0, error };
  }

  const typedData = data as { id: string; read_count: number } | null;
  return { hasRead: !!typedData, readCount: typedData?.read_count || 0, error: null };
}

/**
 * Get reading stats for a user
 */
export async function getReadingStats(supabase: TypedSupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('reading_history')
    .select('article_category, read_count, read_duration_seconds')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching reading stats:', error);
    return {
      stats: {
        totalArticles: 0,
        totalReads: 0,
        totalDuration: 0,
        byCategory: {},
      },
      error,
    };
  }

  // Calculate stats
  const totalArticles = data.length;
  const totalReads = data.reduce(
    (sum: number, item: ReadingHistory) => sum + item.read_count,
    0
  );
  const totalDuration = data.reduce(
    (sum: number, item: ReadingHistory) => sum + (item.read_duration_seconds || 0),
    0
  );

  // Group by category
  const byCategory: Record<string, { articles: number; reads: number }> = {};
  data.forEach((item: ReadingHistory) => {
    if (!byCategory[item.article_category]) {
      byCategory[item.article_category] = { articles: 0, reads: 0 };
    }
    byCategory[item.article_category].articles += 1;
    byCategory[item.article_category].reads += item.read_count;
  });

  return {
    stats: {
      totalArticles,
      totalReads,
      totalDuration,
      byCategory,
    },
    error: null,
  };
}

/**
 * Clear reading history (all or by category)
 */
export async function clearReadingHistory(
  supabase: TypedSupabaseClient,
  userId: string,
  category?: string
) {
  let query = supabase.from('reading_history').delete().eq('user_id', userId);

  if (category) {
    query = query.eq('article_category', category);
  }

  const { error } = await query;

  if (error) {
    console.error('Error clearing reading history:', error);
    return { success: false, error };
  }

  return { success: true, error: null };
}

/**
 * Get recently read articles
 */
export async function getRecentlyRead(
  supabase: TypedSupabaseClient,
  userId: string,
  limit: number = 10
) {
  const { data, error } = await supabase
    .from('reading_history')
    .select('*')
    .eq('user_id', userId)
    .order('last_read_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recently read:', error);
    return { articles: [], error };
  }

  return { articles: data as ReadingHistory[], error: null };
}
