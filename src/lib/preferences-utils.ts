/**
 * Preferences Management Utilities
 *
 * Helper functions and React hooks for managing user preferences
 * Integrates with data-store.ts for persistent storage
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserPreferences, NewsSource, Category } from '@/types/index';

/**
 * Default user preferences
 */
export const DEFAULT_PREFERENCES: UserPreferences = {
  favoriteCategories: [],
  favoriteSources: [],
  articleAgePreferenceDays: 7,
  hiddenCategories: [],
  hiddenSources: [],
  refreshIntervalMinutes: 30,
  articlesPerPage: 20,
  defaultView: 'grid',
};

/**
 * Load preferences from localStorage (client-side only)
 * Falls back to API call for server-rendered pages
 *
 * @returns Promise<UserPreferences>
 */
export async function loadPreferences(): Promise<UserPreferences> {
  // Check if running in browser
  if (typeof window === 'undefined') {
    // Server-side: fetch from API
    try {
      const response = await fetch('/api/preferences');
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Error loading preferences from API:', error);
    }
    return DEFAULT_PREFERENCES;
  }

  // Client-side: use localStorage
  try {
    const stored = localStorage.getItem('newshub-preferences');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading preferences from localStorage:', error);
  }

  return DEFAULT_PREFERENCES;
}

/**
 * Save preferences to localStorage and optionally to server
 *
 * @param preferences - UserPreferences to save
 */
export async function savePreferences(preferences: UserPreferences): Promise<void> {
  // Save to localStorage
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('newshub-preferences', JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving preferences to localStorage:', error);
    }
  }

  // Also save to server via API
  try {
    await fetch('/api/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences),
    });
  } catch (error) {
    console.error('Error saving preferences to server:', error);
  }
}

/**
 * Update a single preference field
 *
 * @param key - Preference key to update
 * @param value - New value for the preference
 */
export async function updatePreference<K extends keyof UserPreferences>(
  key: K,
  value: UserPreferences[K]
): Promise<UserPreferences> {
  const currentPreferences = await loadPreferences();
  const updatedPreferences = {
    ...currentPreferences,
    [key]: value,
  };
  await savePreferences(updatedPreferences);
  return updatedPreferences;
}

/**
 * Reset preferences to defaults
 */
export async function resetPreferences(): Promise<UserPreferences> {
  await savePreferences(DEFAULT_PREFERENCES);
  return DEFAULT_PREFERENCES;
}

/**
 * Validate RSS feed URL
 *
 * @param url - RSS feed URL to validate
 * @returns Promise<boolean> - true if valid, false otherwise
 */
export async function validateRSSFeed(url: string): Promise<boolean> {
  try {
    const response = await fetch('/api/validate-rss', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      return false;
    }

    const result = await response.json();
    return result.valid === true;
  } catch (error) {
    console.error('Error validating RSS feed:', error);
    return false;
  }
}

/**
 * React Hook: usePreferences
 *
 * Manages user preferences with automatic loading and saving
 *
 * @returns {object} - Preferences state and update functions
 */
export function usePreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load preferences on mount
  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const prefs = await loadPreferences();
        setPreferences(prefs);
        setError(null);
      } catch (err) {
        setError('Failed to load preferences');
        console.error('Error loading preferences:', err);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  // Update preferences
  const update = useCallback(async (updates: Partial<UserPreferences>) => {
    try {
      setIsSaving(true);
      const updatedPrefs = { ...preferences, ...updates };
      await savePreferences(updatedPrefs);
      setPreferences(updatedPrefs);
      setError(null);
    } catch (err) {
      setError('Failed to save preferences');
      console.error('Error saving preferences:', err);
    } finally {
      setIsSaving(false);
    }
  }, [preferences]);

  // Reset to defaults
  const reset = useCallback(async () => {
    try {
      setIsSaving(true);
      const defaultPrefs = await resetPreferences();
      setPreferences(defaultPrefs);
      setError(null);
    } catch (err) {
      setError('Failed to reset preferences');
      console.error('Error resetting preferences:', err);
    } finally {
      setIsSaving(false);
    }
  }, []);

  return {
    preferences,
    isLoading,
    isSaving,
    error,
    updatePreferences: update,
    resetPreferences: reset,
  };
}

/**
 * React Hook: useSources
 *
 * Manages RSS sources with CRUD operations
 *
 * @returns {object} - Sources state and CRUD functions
 */
export function useSources() {
  const [sources, setSources] = useState<NewsSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load sources on mount
  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/sources');
        if (response.ok) {
          const data = await response.json();
          setSources(data);
          setError(null);
        } else {
          throw new Error('Failed to load sources');
        }
      } catch (err) {
        setError('Failed to load sources');
        console.error('Error loading sources:', err);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  // Add source
  const addSource = useCallback(async (source: NewsSource) => {
    try {
      const response = await fetch('/api/sources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(source),
      });

      if (!response.ok) {
        throw new Error('Failed to add source');
      }

      const newSource = await response.json();
      setSources((prev) => [...prev, newSource]);
      setError(null);
    } catch (err) {
      setError('Failed to add source');
      console.error('Error adding source:', err);
      throw err;
    }
  }, []);

  // Update source
  const updateSource = useCallback(async (sourceId: string, updates: Partial<NewsSource>) => {
    try {
      const response = await fetch(`/api/sources/${sourceId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update source');
      }

      const updatedSource = await response.json();
      setSources((prev) =>
        prev.map((source) => (source.id === sourceId ? updatedSource : source))
      );
      setError(null);
    } catch (err) {
      setError('Failed to update source');
      console.error('Error updating source:', err);
      throw err;
    }
  }, []);

  // Delete source
  const deleteSource = useCallback(async (sourceId: string) => {
    try {
      const response = await fetch(`/api/sources/${sourceId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete source');
      }

      setSources((prev) => prev.filter((source) => source.id !== sourceId));
      setError(null);
    } catch (err) {
      setError('Failed to delete source');
      console.error('Error deleting source:', err);
      throw err;
    }
  }, []);

  // Test RSS feed
  const testSource = useCallback(async (rssUrl: string): Promise<boolean> => {
    return await validateRSSFeed(rssUrl);
  }, []);

  return {
    sources,
    isLoading,
    error,
    addSource,
    updateSource,
    deleteSource,
    testSource,
  };
}

/**
 * Add a favorite category
 */
export async function addFavoriteCategory(category: Category): Promise<void> {
  const prefs = await loadPreferences();
  if (!prefs.favoriteCategories.includes(category)) {
    await updatePreference('favoriteCategories', [...prefs.favoriteCategories, category]);
  }
}

/**
 * Remove a favorite category
 */
export async function removeFavoriteCategory(category: Category): Promise<void> {
  const prefs = await loadPreferences();
  await updatePreference(
    'favoriteCategories',
    prefs.favoriteCategories.filter((c) => c !== category)
  );
}

/**
 * Add a favorite source
 */
export async function addFavoriteSource(sourceId: string): Promise<void> {
  const prefs = await loadPreferences();
  if (!prefs.favoriteSources.includes(sourceId)) {
    await updatePreference('favoriteSources', [...prefs.favoriteSources, sourceId]);
  }
}

/**
 * Remove a favorite source
 */
export async function removeFavoriteSource(sourceId: string): Promise<void> {
  const prefs = await loadPreferences();
  await updatePreference(
    'favoriteSources',
    prefs.favoriteSources.filter((s) => s !== sourceId)
  );
}

/**
 * Toggle category visibility
 */
export async function toggleCategoryVisibility(category: Category): Promise<void> {
  const prefs = await loadPreferences();
  const hiddenCategories = prefs.hiddenCategories || [];

  if (hiddenCategories.includes(category)) {
    await updatePreference(
      'hiddenCategories',
      hiddenCategories.filter((c) => c !== category)
    );
  } else {
    await updatePreference('hiddenCategories', [...hiddenCategories, category]);
  }
}

/**
 * Toggle source visibility
 */
export async function toggleSourceVisibility(sourceId: string): Promise<void> {
  const prefs = await loadPreferences();
  const hiddenSources = prefs.hiddenSources || [];

  if (hiddenSources.includes(sourceId)) {
    await updatePreference(
      'hiddenSources',
      hiddenSources.filter((s) => s !== sourceId)
    );
  } else {
    await updatePreference('hiddenSources', [...hiddenSources, sourceId]);
  }
}

/**
 * Get preference statistics
 */
export async function getPreferenceStats(): Promise<{
  totalFavoriteCategories: number;
  totalFavoriteSources: number;
  totalHiddenCategories: number;
  totalHiddenSources: number;
  articlesPerPage: number;
  refreshInterval: number;
  articleAge: number;
}> {
  const prefs = await loadPreferences();

  return {
    totalFavoriteCategories: prefs.favoriteCategories.length,
    totalFavoriteSources: prefs.favoriteSources.length,
    totalHiddenCategories: prefs.hiddenCategories?.length || 0,
    totalHiddenSources: prefs.hiddenSources?.length || 0,
    articlesPerPage: prefs.articlesPerPage,
    refreshInterval: prefs.refreshIntervalMinutes,
    articleAge: prefs.articleAgePreferenceDays,
  };
}
