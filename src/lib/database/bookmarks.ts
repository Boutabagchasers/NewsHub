/**
 * Bookmarks Database Utilities
 * CRUD operations for user bookmarks
 */

import type { TypedSupabaseClient } from '../supabase/types';
import type { Database } from '../supabase/database.types';

type Bookmark = Database['public']['Tables']['bookmarks']['Row'];
type BookmarkInsert = Database['public']['Tables']['bookmarks']['Insert'];
type BookmarkUpdate = Database['public']['Tables']['bookmarks']['Update'];

/**
 * Get all bookmarks for a user
 */
export async function getUserBookmarks(
  supabase: TypedSupabaseClient,
  userId: string,
  options?: {
    category?: string;
    tags?: string[];
    limit?: number;
    offset?: number;
  }
) {
  let query = supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  // Filter by category
  if (options?.category) {
    query = query.eq('article_category', options.category);
  }

  // Filter by tags (contains any of the specified tags)
  if (options?.tags && options.tags.length > 0) {
    query = query.overlaps('tags', options.tags);
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
    console.error('Error fetching bookmarks:', error);
    return { bookmarks: [], error };
  }

  return { bookmarks: data as Bookmark[], error: null };
}

/**
 * Add a new bookmark
 */
export async function addBookmark(supabase: TypedSupabaseClient, bookmark: BookmarkInsert) {
  const { data, error } = await supabase
    .from('bookmarks')
    .insert(bookmark as never)
    .select()
    .single();

  if (error) {
    console.error('Error adding bookmark:', error);
    return { bookmark: null, error };
  }

  return { bookmark: data as Bookmark, error: null };
}

/**
 * Update a bookmark (notes, tags)
 */
export async function updateBookmark(
  supabase: TypedSupabaseClient,
  bookmarkId: string,
  updates: BookmarkUpdate
) {
  const { data, error } = await supabase
    .from('bookmarks')
    .update(updates as never)
    .eq('id', bookmarkId)
    .select()
    .single();

  if (error) {
    console.error('Error updating bookmark:', error);
    return { bookmark: null, error };
  }

  return { bookmark: data as Bookmark, error: null };
}

/**
 * Remove a bookmark
 */
export async function removeBookmark(supabase: TypedSupabaseClient, bookmarkId: string) {
  const { error } = await supabase.from('bookmarks').delete().eq('id', bookmarkId);

  if (error) {
    console.error('Error removing bookmark:', error);
    return { success: false, error };
  }

  return { success: true, error: null };
}

/**
 * Check if an article is bookmarked
 */
export async function isArticleBookmarked(
  supabase: TypedSupabaseClient,
  userId: string,
  articleUrl: string
) {
  const { data, error } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('user_id', userId)
    .eq('article_url', articleUrl)
    .maybeSingle();

  if (error) {
    console.error('Error checking bookmark:', error);
    return { isBookmarked: false, error };
  }

  return { isBookmarked: !!data, error: null };
}

/**
 * Get bookmark count by category
 */
export async function getBookmarkCountByCategory(supabase: TypedSupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('bookmarks')
    .select('article_category')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching bookmark counts:', error);
    return { counts: {}, error };
  }

  // Count by category
  const counts: Record<string, number> = {};
  data.forEach((bookmark: { article_category: string }) => {
    counts[bookmark.article_category] = (counts[bookmark.article_category] || 0) + 1;
  });

  return { counts, error: null };
}

/**
 * Search bookmarks by title or snippet
 */
export async function searchBookmarks(
  supabase: TypedSupabaseClient,
  userId: string,
  searchQuery: string
) {
  const { data, error } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', userId)
    .or(
      `article_title.ilike.%${searchQuery}%,article_snippet.ilike.%${searchQuery}%`
    )
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching bookmarks:', error);
    return { bookmarks: [], error };
  }

  return { bookmarks: data as Bookmark[], error: null };
}
