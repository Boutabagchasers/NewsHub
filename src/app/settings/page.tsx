'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Heart,
  Layout,
  RefreshCw,
  Rss,
  RotateCcw,
  Save,
} from 'lucide-react';
import PreferenceSection from '@/components/PreferenceSection';
import SourceManager from '@/components/SourceManager';
import { usePreferences, useSources } from '@/lib/preferences-utils';
import { Category } from '@/types/index';

/**
 * Settings/Preferences Page
 *
 * Comprehensive settings interface with sections for:
 * 1. Favorite Categories
 * 2. Favorite Sources
 * 3. Display Preferences
 * 4. Refresh Settings
 * 5. RSS Feed Management
 */
export default function SettingsPage() {
  const {
    preferences,
    isLoading: prefsLoading,
    isSaving,
    updatePreferences,
    resetPreferences,
  } = usePreferences();

  const {
    sources,
    isLoading: sourcesLoading,
    addSource,
    updateSource,
    deleteSource,
    testSource,
  } = useSources();

  // Local state for form changes
  const [localPrefs, setLocalPrefs] = useState(preferences);
  const [hasChanges, setHasChanges] = useState(false);
  const [savedSections, setSavedSections] = useState<Set<string>>(new Set());
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Available categories
  const categories: Category[] = [
    'U.S. News',
    'World News',
    'Local News',
    'Sports',
    'Technology',
    'Business',
    'Entertainment',
    'Health',
    'Science',
  ];

  // Update local prefs when preferences load
  useEffect(() => {
    setLocalPrefs(preferences);
  }, [preferences]);

  // Check if there are unsaved changes
  useEffect(() => {
    const changed = JSON.stringify(localPrefs) !== JSON.stringify(preferences);
    setHasChanges(changed);
  }, [localPrefs, preferences]);

  // Handle save preferences
  const handleSave = async (sectionName?: string) => {
    await updatePreferences(localPrefs);

    if (sectionName) {
      setSavedSections((prev) => new Set(prev).add(sectionName));
      setTimeout(() => {
        setSavedSections((prev) => {
          const newSet = new Set(prev);
          newSet.delete(sectionName);
          return newSet;
        });
      }, 2000);
    }
  };

  // Handle reset to defaults
  const handleReset = async () => {
    await resetPreferences();
    setShowResetConfirm(false);
  };

  // Handle manual refresh
  const handleManualRefresh = async () => {
    try {
      const response = await fetch('/api/articles/refresh', { method: 'POST' });

      if (!response.ok) {
        console.error(`Refresh API error: ${response.status} ${response.statusText}`);
        alert('Failed to trigger refresh. Please try again.');
        return;
      }

      alert('Refresh started! Articles will be updated shortly.');
    } catch (error) {
      console.error('Error triggering refresh:', error);
      alert('Failed to trigger refresh. Please try again.');
    }
  };

  // Toggle favorite category
  const toggleFavoriteCategory = (category: Category) => {
    setLocalPrefs((prev) => {
      const favorites = prev.favoriteCategories.includes(category)
        ? prev.favoriteCategories.filter((c) => c !== category)
        : [...prev.favoriteCategories, category];
      return { ...prev, favoriteCategories: favorites };
    });
  };

  // Toggle favorite source
  const toggleFavoriteSource = (sourceId: string) => {
    setLocalPrefs((prev) => {
      const favorites = prev.favoriteSources.includes(sourceId)
        ? prev.favoriteSources.filter((s) => s !== sourceId)
        : [...prev.favoriteSources, sourceId];
      return { ...prev, favoriteSources: favorites };
    });
  };

  if (prefsLoading || sourcesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-background-elevated border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <SettingsIcon size={32} className="text-blue-600" />
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Settings & Preferences</h1>
              </div>
              <p className="text-gray-600">Customize your NewsHub experience</p>
            </div>

            {/* Global Actions */}
            <div className="flex items-center gap-3">
              {hasChanges && (
                <button
                  onClick={() => handleSave()}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
                >
                  <Save size={18} />
                  <span>{isSaving ? 'Saving...' : 'Save All Changes'}</span>
                </button>
              )}

              <button
                onClick={() => setShowResetConfirm(true)}
                className="flex items-center gap-2 px-4 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                <RotateCcw size={18} />
                <span>Reset to Defaults</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-spacing space-y-8">
        {/* Section 1: Favorite Categories */}
        <PreferenceSection
          title="Favorite Categories"
          description="Select your preferred news categories to prioritize them in your feed"
          icon={<Heart size={24} />}
          isSaved={savedSections.has('categories')}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((category) => {
              const isFavorite = localPrefs.favoriteCategories.includes(category);
              return (
                <button
                  key={category}
                  onClick={() => toggleFavoriteCategory(category)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    isFavorite
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-200 bg-background-elevated text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{category}</span>
                    {isFavorite && <Heart size={18} fill="currentColor" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => handleSave('categories')}
              disabled={!hasChanges || isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
            >
              Save Category Preferences
            </button>
          </div>
        </PreferenceSection>

        {/* Section 2: Favorite Sources */}
        <PreferenceSection
          title="Favorite Sources"
          description="Mark your preferred news sources for quick access"
          icon={<Rss size={24} />}
          isSaved={savedSections.has('sources')}
        >
          {sources.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No sources configured yet.</p>
              <p className="text-sm mt-2">Add sources in the RSS Feed Management section below.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sources.map((source) => {
                const isFavorite = localPrefs.favoriteSources.includes(source.id);
                return (
                  <div
                    key={source.id}
                    className={`p-4 rounded-lg border flex items-center justify-between ${
                      isFavorite
                        ? 'border-blue-300 bg-blue-50'
                        : 'border-gray-200 bg-background-elevated'
                    }`}
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">{source.name}</h4>
                      <p className="text-sm text-gray-600">
                        {source.category}
                        {source.subcategory && ` / ${source.subcategory}`}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleFavoriteSource(source.id)}
                      className={`p-2 rounded-full transition-colors ${
                        isFavorite
                          ? 'text-blue-600 hover:bg-blue-100'
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                    >
                      <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => handleSave('sources')}
              disabled={!hasChanges || isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
            >
              Save Source Preferences
            </button>
          </div>
        </PreferenceSection>

        {/* Section 3: Display Preferences */}
        <PreferenceSection
          title="Display Preferences"
          description="Customize how articles are displayed in your feed"
          icon={<Layout size={24} />}
          isSaved={savedSections.has('display')}
        >
          <div className="space-y-6">
            {/* Articles Per Page */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Articles Per Page
              </label>
              <select
                value={localPrefs.articlesPerPage}
                onChange={(e) =>
                  setLocalPrefs({ ...localPrefs, articlesPerPage: parseInt(e.target.value) })
                }
                className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="10">10 articles</option>
                <option value="20">20 articles</option>
                <option value="30">30 articles</option>
                <option value="50">50 articles</option>
                <option value="100">100 articles</option>
              </select>
            </div>

            {/* Default View */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default View Mode
              </label>
              <div className="flex gap-3">
                {(['grid', 'list', 'compact'] as const).map((view) => (
                  <button
                    key={view}
                    onClick={() => setLocalPrefs({ ...localPrefs, defaultView: view })}
                    className={`px-6 py-3 rounded-md border-2 transition-all ${
                      localPrefs.defaultView === view
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-200 bg-background-elevated text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {view.charAt(0).toUpperCase() + view.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Article Age Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Show Articles From Last
              </label>
              <select
                value={localPrefs.articleAgePreferenceDays}
                onChange={(e) =>
                  setLocalPrefs({
                    ...localPrefs,
                    articleAgePreferenceDays: parseInt(e.target.value),
                  })
                }
                className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="1">24 hours</option>
                <option value="3">3 days</option>
                <option value="7">7 days</option>
                <option value="14">14 days</option>
                <option value="30">30 days</option>
              </select>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={() => handleSave('display')}
              disabled={!hasChanges || isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
            >
              Save Display Preferences
            </button>
          </div>
        </PreferenceSection>

        {/* Section 4: Refresh Settings */}
        <PreferenceSection
          title="Refresh Settings"
          description="Configure automatic refresh and manually trigger article updates"
          icon={<RefreshCw size={24} />}
          isSaved={savedSections.has('refresh')}
        >
          <div className="space-y-6">
            {/* Auto-refresh Interval */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Auto-Refresh Interval
              </label>
              <select
                value={localPrefs.refreshIntervalMinutes}
                onChange={(e) =>
                  setLocalPrefs({
                    ...localPrefs,
                    refreshIntervalMinutes: parseInt(e.target.value),
                  })
                }
                className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="5">Every 5 minutes</option>
                <option value="15">Every 15 minutes</option>
                <option value="30">Every 30 minutes</option>
                <option value="60">Every hour</option>
                <option value="120">Every 2 hours</option>
                <option value="0">Manual only (disabled)</option>
              </select>
              <p className="text-sm text-gray-500 mt-2">
                How often NewsHub should automatically fetch new articles
              </p>
            </div>

            {/* Manual Refresh Button */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Manual Refresh
              </label>
              <button
                onClick={handleManualRefresh}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <RefreshCw size={18} />
                <span>Refresh All Articles Now</span>
              </button>
              <p className="text-sm text-gray-500 mt-2">
                Immediately fetch latest articles from all active sources
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={() => handleSave('refresh')}
              disabled={!hasChanges || isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
            >
              Save Refresh Settings
            </button>
          </div>
        </PreferenceSection>

        {/* Section 5: RSS Feed Management */}
        <PreferenceSection
          title="RSS Feed Management"
          description="Add, edit, and manage your RSS news sources"
          icon={<Rss size={24} />}
        >
          <SourceManager
            sources={sources}
            onAddSource={addSource}
            onUpdateSource={updateSource}
            onDeleteSource={deleteSource}
            onTestSource={testSource}
          />
        </PreferenceSection>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background-elevated rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Reset to Default Settings?
            </h3>
            <p className="text-gray-600 mb-6">
              This will reset all your preferences to their default values. This action cannot be
              undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Reset Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
