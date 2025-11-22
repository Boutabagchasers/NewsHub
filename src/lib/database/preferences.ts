/**
 * User Preferences Database Utilities
 * Manage user settings and customization
 */

import type { TypedSupabaseClient } from '../supabase/types';
import type { Database } from '../supabase/database.types';

type UserPreferences = Database['public']['Tables']['user_preferences']['Row'];
type UserPreferencesInsert = Database['public']['Tables']['user_preferences']['Insert'];
type UserPreferencesUpdate = Database['public']['Tables']['user_preferences']['Update'];

/**
 * Default preferences for new users
 */
export const DEFAULT_PREFERENCES: Omit<
  UserPreferencesInsert,
  'user_id' | 'id' | 'created_at' | 'updated_at'
> = {
  theme: 'system',
  favorite_categories: [],
  blocked_sources: [],
  notification_settings: {
    daily_brief: true,
    breaking_news: false,
    category_updates: false,
    email_frequency: 'daily',
  },
  display_settings: {
    articles_per_page: 20,
    show_images: true,
    compact_view: false,
    auto_mark_read: true,
  },
};

/**
 * Get user preferences
 * Creates default preferences if none exist
 */
export async function getUserPreferences(supabase: TypedSupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching preferences:', error);
    return { preferences: null, error };
  }

  // Create default preferences if none exist
  if (!data) {
    const { preferences: newPrefs, error: createError } = await createUserPreferences(
      supabase,
      userId
    );
    return { preferences: newPrefs, error: createError };
  }

  return { preferences: data as UserPreferences, error: null };
}

/**
 * Create default preferences for a new user
 */
export async function createUserPreferences(supabase: TypedSupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('user_preferences')
    .insert({
      user_id: userId,
      ...DEFAULT_PREFERENCES,
    } as never)
    .select()
    .single();

  if (error) {
    console.error('Error creating preferences:', error);
    return { preferences: null, error };
  }

  return { preferences: data as UserPreferences, error: null };
}

/**
 * Update user preferences
 */
export async function updateUserPreferences(
  supabase: TypedSupabaseClient,
  userId: string,
  updates: UserPreferencesUpdate
) {
  const { data, error } = await supabase
    .from('user_preferences')
    .update(updates as never)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating preferences:', error);
    return { preferences: null, error };
  }

  return { preferences: data as UserPreferences, error: null };
}

/**
 * Update theme preference
 */
export async function updateTheme(
  supabase: TypedSupabaseClient,
  userId: string,
  theme: 'light' | 'dark' | 'system'
) {
  return updateUserPreferences(supabase, userId, { theme });
}

/**
 * Add favorite category
 */
export async function addFavoriteCategory(
  supabase: TypedSupabaseClient,
  userId: string,
  category: string
) {
  const { preferences } = await getUserPreferences(supabase, userId);
  if (!preferences) return { success: false, error: 'Preferences not found' };

  const currentCategories = preferences.favorite_categories || [];
  if (currentCategories.includes(category)) {
    return { success: true, error: null }; // Already a favorite
  }

  return updateUserPreferences(supabase, userId, {
    favorite_categories: [...currentCategories, category],
  });
}

/**
 * Remove favorite category
 */
export async function removeFavoriteCategory(
  supabase: TypedSupabaseClient,
  userId: string,
  category: string
) {
  const { preferences } = await getUserPreferences(supabase, userId);
  if (!preferences) return { success: false, error: 'Preferences not found' };

  const currentCategories = preferences.favorite_categories || [];
  const updatedCategories = currentCategories.filter((cat) => cat !== category);

  return updateUserPreferences(supabase, userId, {
    favorite_categories: updatedCategories,
  });
}

/**
 * Block a news source
 */
export async function blockSource(supabase: TypedSupabaseClient, userId: string, source: string) {
  const { preferences } = await getUserPreferences(supabase, userId);
  if (!preferences) return { success: false, error: 'Preferences not found' };

  const currentBlocked = preferences.blocked_sources || [];
  if (currentBlocked.includes(source)) {
    return { success: true, error: null }; // Already blocked
  }

  return updateUserPreferences(supabase, userId, {
    blocked_sources: [...currentBlocked, source],
  });
}

/**
 * Unblock a news source
 */
export async function unblockSource(supabase: TypedSupabaseClient, userId: string, source: string) {
  const { preferences } = await getUserPreferences(supabase, userId);
  if (!preferences) return { success: false, error: 'Preferences not found' };

  const currentBlocked = preferences.blocked_sources || [];
  const updatedBlocked = currentBlocked.filter((s) => s !== source);

  return updateUserPreferences(supabase, userId, {
    blocked_sources: updatedBlocked,
  });
}

/**
 * Update notification settings
 */
export async function updateNotificationSettings(
  supabase: TypedSupabaseClient,
  userId: string,
  settings: Partial<{
    daily_brief: boolean;
    breaking_news: boolean;
    category_updates: boolean;
    email_frequency: string;
  }>
) {
  const { preferences } = await getUserPreferences(supabase, userId);
  if (!preferences) return { success: false, error: 'Preferences not found' };

  const updatedSettings = {
    ...(preferences.notification_settings as object),
    ...settings,
  };

  return updateUserPreferences(supabase, userId, {
    notification_settings: updatedSettings,
  });
}

/**
 * Update display settings
 */
export async function updateDisplaySettings(
  supabase: TypedSupabaseClient,
  userId: string,
  settings: Partial<{
    articles_per_page: number;
    show_images: boolean;
    compact_view: boolean;
    auto_mark_read: boolean;
  }>
) {
  const { preferences } = await getUserPreferences(supabase, userId);
  if (!preferences) return { success: false, error: 'Preferences not found' };

  const updatedSettings = {
    ...(preferences.display_settings as object),
    ...settings,
  };

  return updateUserPreferences(supabase, userId, {
    display_settings: updatedSettings,
  });
}
