'use client';

import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Loader,
  ExternalLink,
  Power,
} from 'lucide-react';
import { NewsSource, Category, Subcategory } from '@/types/index';

/**
 * Props for SourceManager component
 */
interface SourceManagerProps {
  sources: NewsSource[];
  onAddSource: (source: NewsSource) => Promise<void>;
  onUpdateSource: (sourceId: string, updates: Partial<NewsSource>) => Promise<void>;
  onDeleteSource: (sourceId: string) => Promise<void>;
  onTestSource?: (rssUrl: string) => Promise<boolean>;
}

/**
 * Status type for source validation
 */
type SourceStatus = 'idle' | 'checking' | 'active' | 'error';

/**
 * SourceManager Component
 *
 * Comprehensive RSS source management interface with:
 * - List of all RSS sources with status indicators
 * - Add new source form with validation
 * - Edit existing sources
 * - Delete sources with confirmation
 * - Enable/disable toggle
 * - Test feed connection
 */
export default function SourceManager({
  sources,
  onAddSource,
  onUpdateSource,
  onDeleteSource,
  onTestSource,
}: SourceManagerProps) {
  // State management
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSourceId, setEditingSourceId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [testingSourceId, setTestingSourceId] = useState<string | null>(null);
  const [sourceStatuses, setSourceStatuses] = useState<Record<string, SourceStatus>>({});

  // Form state
  const [formData, setFormData] = useState<Partial<NewsSource>>({
    name: '',
    rssUrl: '',
    category: 'U.S. News',
    subcategory: 'General',
    isActive: true,
    fetchIntervalMinutes: 30,
    description: '',
    website: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available categories and subcategories
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

  const subcategories: Subcategory[] = [
    'Bay Area',
    'Sacramento',
    'California',
    'National',
    'International',
    'Politics',
    'NFL',
    'NBA',
    'MLB',
    'Soccer',
    'General Sports',
    'Startups',
    'AI',
    'Gadgets',
    'Software',
    'Finance',
    'Markets',
    'Movies',
    'Music',
    'General',
  ];

  // Validate form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.rssUrl?.trim()) {
      errors.rssUrl = 'RSS URL is required';
    } else if (!isValidUrl(formData.rssUrl)) {
      errors.rssUrl = 'Please enter a valid URL';
    }

    if (!formData.category) {
      errors.category = 'Category is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate URL format
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Test RSS feed
  const handleTestFeed = async (url: string, sourceId?: string) => {
    if (!onTestSource) return;

    const testId = sourceId || 'new-source';
    setTestingSourceId(testId);
    setSourceStatuses((prev) => ({ ...prev, [testId]: 'checking' }));

    try {
      const isValid = await onTestSource(url);
      setSourceStatuses((prev) => ({ ...prev, [testId]: isValid ? 'active' : 'error' }));
    } catch {
      setSourceStatuses((prev) => ({ ...prev, [testId]: 'error' }));
    } finally {
      setTestingSourceId(null);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const newSource: NewsSource = {
        id: editingSourceId || `source-${Date.now()}`,
        name: formData.name!,
        rssUrl: formData.rssUrl!,
        category: formData.category as Category,
        subcategory: formData.subcategory as Subcategory,
        isActive: formData.isActive ?? true,
        fetchIntervalMinutes: formData.fetchIntervalMinutes || 30,
        description: formData.description,
        website: formData.website,
      };

      if (editingSourceId) {
        await onUpdateSource(editingSourceId, newSource);
      } else {
        await onAddSource(newSource);
      }

      // Reset form
      resetForm();
    } catch (error) {
      console.error('Error saving source:', error);
      setFormErrors({ submit: 'Failed to save source. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      rssUrl: '',
      category: 'U.S. News',
      subcategory: 'General',
      isActive: true,
      fetchIntervalMinutes: 30,
      description: '',
      website: '',
    });
    setFormErrors({});
    setShowAddForm(false);
    setEditingSourceId(null);
  };

  // Handle edit
  const handleEdit = (source: NewsSource) => {
    setFormData(source);
    setEditingSourceId(source.id);
    setShowAddForm(true);
  };

  // Handle delete
  const handleDelete = async (sourceId: string) => {
    try {
      await onDeleteSource(sourceId);
      setDeleteConfirmId(null);
    } catch (error) {
      console.error('Error deleting source:', error);
    }
  };

  // Toggle source active status
  const handleToggleActive = async (source: NewsSource) => {
    try {
      await onUpdateSource(source.id, { isActive: !source.isActive });
    } catch (error) {
      console.error('Error toggling source:', error);
    }
  };

  // Get status icon
  const getStatusIcon = (source: NewsSource) => {
    const status = sourceStatuses[source.id] || (source.isActive ? 'active' : 'idle');

    switch (status) {
      case 'checking':
        return <Loader size={16} className="text-blue-500 animate-spin" />;
      case 'active':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'error':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <div className="w-2 h-2 rounded-full bg-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Source Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">
          RSS Sources ({sources.length})
        </h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          <span>{showAddForm ? 'Cancel' : 'Add Source'}</span>
        </button>
      </div>

      {/* Add/Edit Source Form */}
      {showAddForm && (
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h4 className="text-md font-semibold text-gray-900 mb-4">
            {editingSourceId ? 'Edit Source' : 'Add New RSS Source'}
          </h4>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Source Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., New York Times"
              />
              {formErrors.name && (
                <p className="text-red-600 text-sm mt-1">{formErrors.name}</p>
              )}
            </div>

            {/* RSS URL Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                RSS Feed URL *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.rssUrl}
                  onChange={(e) => setFormData({ ...formData, rssUrl: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/rss"
                />
                {onTestSource && (
                  <button
                    type="button"
                    onClick={() => formData.rssUrl && handleTestFeed(formData.rssUrl)}
                    disabled={testingSourceId === 'new-source'}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400 transition-colors"
                  >
                    {testingSourceId === 'new-source' ? 'Testing...' : 'Test'}
                  </button>
                )}
              </div>
              {formErrors.rssUrl && (
                <p className="text-red-600 text-sm mt-1">{formErrors.rssUrl}</p>
              )}
            </div>

            {/* Category and Subcategory */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value as Category })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subcategory
                </label>
                <select
                  value={formData.subcategory}
                  onChange={(e) =>
                    setFormData({ ...formData, subcategory: e.target.value as Subcategory })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {subcategories.map((subcat) => (
                    <option key={subcat} value={subcat}>
                      {subcat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Website URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website URL (optional)
              </label>
              <input
                type="text"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief description of this source"
              />
            </div>

            {/* Fetch Interval */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fetch Interval (minutes)
              </label>
              <input
                type="number"
                min="5"
                max="1440"
                value={formData.fetchIntervalMinutes}
                onChange={(e) =>
                  setFormData({ ...formData, fetchIntervalMinutes: parseInt(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Active Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Active (fetch articles from this source)
              </label>
            </div>

            {/* Form Error */}
            {formErrors.submit && (
              <p className="text-red-600 text-sm">{formErrors.submit}</p>
            )}

            {/* Form Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
              >
                {isSubmitting ? 'Saving...' : editingSourceId ? 'Update Source' : 'Add Source'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sources List */}
      <div className="space-y-3">
        {sources.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No RSS sources configured yet.</p>
            <p className="text-sm mt-2">Click &quot;Add Source&quot; to get started.</p>
          </div>
        ) : (
          sources.map((source) => (
            <div
              key={source.id}
              className="bg-background-elevated border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                {/* Source Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(source)}
                    <h4 className="text-md font-semibold text-gray-900">{source.name}</h4>
                    {!source.isActive && (
                      <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs font-medium rounded">
                        Disabled
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">URL:</span>
                      <a
                        href={source.rssUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        {source.rssUrl.substring(0, 50)}...
                        <ExternalLink size={12} />
                      </a>
                    </div>
                    <div>
                      <span className="font-medium">Category:</span> {source.category}
                      {source.subcategory && ` / ${source.subcategory}`}
                    </div>
                    {source.description && <div>{source.description}</div>}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {/* Toggle Active */}
                  <button
                    onClick={() => handleToggleActive(source)}
                    className={`p-2 rounded-md transition-colors ${
                      source.isActive
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                    title={source.isActive ? 'Disable source' : 'Enable source'}
                  >
                    <Power size={18} />
                  </button>

                  {/* Test Button */}
                  {onTestSource && (
                    <button
                      onClick={() => handleTestFeed(source.rssUrl, source.id)}
                      disabled={testingSourceId === source.id}
                      className="p-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors disabled:bg-blue-50"
                      title="Test RSS feed"
                    >
                      {testingSourceId === source.id ? (
                        <Loader size={18} className="animate-spin" />
                      ) : (
                        <CheckCircle size={18} />
                      )}
                    </button>
                  )}

                  {/* Edit Button */}
                  <button
                    onClick={() => handleEdit(source)}
                    className="p-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    title="Edit source"
                  >
                    <Edit2 size={18} />
                  </button>

                  {/* Delete Button */}
                  {deleteConfirmId === source.id ? (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleDelete(source.id)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(source.id)}
                      className="p-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                      title="Delete source"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
