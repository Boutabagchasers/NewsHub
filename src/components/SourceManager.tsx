/**
 * SourceManager Component - V2.0
 * Comprehensive RSS source management with table/card views and bulk actions
 * Features: View toggle, bulk actions, validation, stats, modern design
 */

'use client';

import React, { useState, useMemo } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Loader2,
  ExternalLink,
  Power,
  Grid3x3,
  List,
  Search,
  Filter,
  MoreVertical,
} from 'lucide-react';
import { NewsSource, Category, Subcategory } from '@/types/index';
import { Button, IconButton } from './ui/button';
import { Badge } from './ui/badge';
import { Modal, ConfirmModal } from './ui/modal';
import { useToast } from './ui/toast';

interface SourceManagerProps {
  sources: NewsSource[];
  onAddSource: (source: NewsSource) => Promise<void>;
  onUpdateSource: (sourceId: string, updates: Partial<NewsSource>) => Promise<void>;
  onDeleteSource: (sourceId: string) => Promise<void>;
  onTestSource?: (rssUrl: string) => Promise<boolean>;
}

type SourceStatus = 'idle' | 'checking' | 'active' | 'error';
type ViewMode = 'card' | 'table';

export default function SourceManager({
  sources,
  onAddSource,
  onUpdateSource,
  onDeleteSource,
  onTestSource,
}: SourceManagerProps) {
  // View state
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSourceId, setEditingSourceId] = useState<string | null>(null);
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

  // Bulk actions state
  const [selectedSources, setSelectedSources] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Modals
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);

  // Testing state
  const [testingSourceId, setTestingSourceId] = useState<string | null>(null);
  const [sourceStatuses, setSourceStatuses] = useState<Record<string, SourceStatus>>({});

  const { toast } = useToast();

  // Categories
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
    'Bay Area', 'Sacramento', 'California', 'National', 'International',
    'Politics', 'NFL', 'NBA', 'MLB', 'Soccer', 'General Sports',
    'Startups', 'AI', 'Gadgets', 'Software', 'Finance', 'Markets',
    'Movies', 'Music', 'General',
  ];

  // Filtered sources
  const filteredSources = useMemo(() => {
    return sources.filter((source) => {
      const matchesSearch =
        searchQuery === '' ||
        source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        source.rssUrl.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' || source.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [sources, searchQuery, selectedCategory]);

  // Stats
  const stats = useMemo(() => ({
    total: sources.length,
    active: sources.filter((s) => s.isActive).length,
    inactive: sources.filter((s) => !s.isActive).length,
  }), [sources]);

  // Validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name?.trim()) errors.name = 'Name is required';
    if (!formData.rssUrl?.trim()) {
      errors.rssUrl = 'RSS URL is required';
    } else if (!isValidUrl(formData.rssUrl)) {
      errors.rssUrl = 'Please enter a valid URL';
    }
    if (!formData.category) errors.category = 'Category is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Test feed
  const handleTestFeed = async (url: string, sourceId?: string) => {
    if (!onTestSource) return;

    const testId = sourceId || 'new-source';
    setTestingSourceId(testId);
    setSourceStatuses((prev) => ({ ...prev, [testId]: 'checking' }));

    try {
      const isValid = await onTestSource(url);
      setSourceStatuses((prev) => ({ ...prev, [testId]: isValid ? 'active' : 'error' }));
      toast[isValid ? 'success' : 'error'](
        isValid ? 'RSS feed is valid!' : 'Failed to validate RSS feed'
      );
    } catch {
      setSourceStatuses((prev) => ({ ...prev, [testId]: 'error' }));
      toast.error('Failed to test RSS feed');
    } finally {
      setTestingSourceId(null);
    }
  };

  // Form submission
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
        toast.success('Source updated successfully!');
      } else {
        await onAddSource(newSource);
        toast.success('Source added successfully!');
      }

      resetForm();
    } catch (error) {
      toast.error('Failed to save source');
      setFormErrors({ submit: 'Failed to save source. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const handleEdit = (source: NewsSource) => {
    setFormData(source);
    setEditingSourceId(source.id);
    setShowAddForm(true);
  };

  const handleDelete = async (sourceId: string) => {
    try {
      await onDeleteSource(sourceId);
      toast.success('Source deleted successfully!');
      setDeleteConfirmId(null);
    } catch (error) {
      toast.error('Failed to delete source');
    }
  };

  const handleToggleActive = async (source: NewsSource) => {
    try {
      await onUpdateSource(source.id, { isActive: !source.isActive });
      toast.success(`Source ${source.isActive ? 'disabled' : 'enabled'}`);
    } catch (error) {
      toast.error('Failed to toggle source');
    }
  };

  // Bulk actions
  const toggleSelectSource = (sourceId: string) => {
    setSelectedSources((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sourceId)) {
        newSet.delete(sourceId);
      } else {
        newSet.add(sourceId);
      }
      setShowBulkActions(newSet.size > 0);
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedSources.size === filteredSources.length) {
      setSelectedSources(new Set());
      setShowBulkActions(false);
    } else {
      setSelectedSources(new Set(filteredSources.map((s) => s.id)));
      setShowBulkActions(true);
    }
  };

  const handleBulkEnable = async () => {
    try {
      await Promise.all(
        Array.from(selectedSources).map((id) =>
          onUpdateSource(id, { isActive: true })
        )
      );
      toast.success(`Enabled ${selectedSources.size} sources`);
      setSelectedSources(new Set());
      setShowBulkActions(false);
    } catch {
      toast.error('Failed to enable sources');
    }
  };

  const handleBulkDisable = async () => {
    try {
      await Promise.all(
        Array.from(selectedSources).map((id) =>
          onUpdateSource(id, { isActive: false })
        )
      );
      toast.success(`Disabled ${selectedSources.size} sources`);
      setSelectedSources(new Set());
      setShowBulkActions(false);
    } catch {
      toast.error('Failed to disable sources');
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        Array.from(selectedSources).map((id) => onDeleteSource(id))
      );
      toast.success(`Deleted ${selectedSources.size} sources`);
      setSelectedSources(new Set());
      setShowBulkActions(false);
      setBulkDeleteConfirm(false);
    } catch {
      toast.error('Failed to delete sources');
    }
  };

  const getStatusIcon = (source: NewsSource) => {
    const status = sourceStatuses[source.id] || (source.isActive ? 'active' : 'idle');

    switch (status) {
      case 'checking':
        return <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'var(--accent-primary)' }} />;
      case 'active':
        return <CheckCircle className="w-4 h-4" style={{ color: 'var(--color-success)' }} />;
      case 'error':
        return <XCircle className="w-4 h-4" style={{ color: 'var(--color-error)' }} />;
      default:
        return <div className="w-2 h-2 rounded-full" style={{ background: 'var(--text-tertiary)' }} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div
        className="p-6 rounded-lg"
        style={{
          background: 'var(--background-elevated)',
          border: '1px solid var(--border-primary)',
        }}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
              RSS Source Management
            </h3>
            <div className="flex items-center gap-4 flex-wrap">
              <Badge variant="primary" size="md">
                {stats.total} Total
              </Badge>
              <Badge variant="success" size="md">
                {stats.active} Active
              </Badge>
              <Badge variant="secondary" size="md">
                {stats.inactive} Inactive
              </Badge>
            </div>
          </div>
          <Button
            variant="primary"
            size="lg"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Cancel' : 'Add Source'}
          </Button>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {showBulkActions && (
        <div
          className="p-4 rounded-lg flex items-center justify-between gap-4 flex-wrap animate-scale-in"
          style={{
            background: 'var(--accent-primary)',
            color: 'white',
          }}
        >
          <span className="font-medium">
            {selectedSources.size} source{selectedSources.size !== 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="secondary" size="sm" onClick={handleBulkEnable}>
              Enable All
            </Button>
            <Button variant="secondary" size="sm" onClick={handleBulkDisable}>
              Disable All
            </Button>
            <Button variant="danger" size="sm" onClick={() => setBulkDeleteConfirm(true)}>
              Delete Selected
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedSources(new Set());
                setShowBulkActions(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      <Modal
        isOpen={showAddForm}
        onClose={resetForm}
        title={editingSourceId ? 'Edit RSS Source' : 'Add New RSS Source'}
        size="lg"
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={resetForm}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              isLoading={isSubmitting}
            >
              {editingSourceId ? 'Update Source' : 'Add Source'}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
              Source Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg font-medium"
              style={{
                background: 'var(--background-primary)',
                border: '1px solid var(--border-primary)',
                color: 'var(--foreground)',
              }}
              placeholder="e.g., New York Times"
            />
            {formErrors.name && (
              <p className="text-sm mt-1" style={{ color: 'var(--color-error)' }}>
                {formErrors.name}
              </p>
            )}
          </div>

          {/* RSS URL Input */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
              RSS Feed URL *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.rssUrl}
                onChange={(e) => setFormData({ ...formData, rssUrl: e.target.value })}
                className="flex-1 px-4 py-3 rounded-lg font-medium"
                style={{
                  background: 'var(--background-primary)',
                  border: '1px solid var(--border-primary)',
                  color: 'var(--foreground)',
                }}
                placeholder="https://example.com/rss"
              />
              {onTestSource && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => formData.rssUrl && handleTestFeed(formData.rssUrl)}
                  isLoading={testingSourceId === 'new-source'}
                >
                  Test
                </Button>
              )}
            </div>
            {formErrors.rssUrl && (
              <p className="text-sm mt-1" style={{ color: 'var(--color-error)' }}>
                {formErrors.rssUrl}
              </p>
            )}
          </div>

          {/* Category and Subcategory */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                className="w-full px-4 py-3 rounded-lg font-medium"
                style={{
                  background: 'var(--background-primary)',
                  border: '1px solid var(--border-primary)',
                  color: 'var(--foreground)',
                }}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                Subcategory
              </label>
              <select
                value={formData.subcategory}
                onChange={(e) =>
                  setFormData({ ...formData, subcategory: e.target.value as Subcategory })
                }
                className="w-full px-4 py-3 rounded-lg font-medium"
                style={{
                  background: 'var(--background-primary)',
                  border: '1px solid var(--border-primary)',
                  color: 'var(--foreground)',
                }}
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
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
              Website URL (optional)
            </label>
            <input
              type="text"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="w-full px-4 py-3 rounded-lg font-medium"
              style={{
                background: 'var(--background-primary)',
                border: '1px solid var(--border-primary)',
                color: 'var(--foreground)',
              }}
              placeholder="https://example.com"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
              Description (optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 rounded-lg font-medium"
              style={{
                background: 'var(--background-primary)',
                border: '1px solid var(--border-primary)',
                color: 'var(--foreground)',
              }}
              placeholder="Brief description of this source"
            />
          </div>

          {/* Fetch Interval */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
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
              className="w-full px-4 py-3 rounded-lg font-medium"
              style={{
                background: 'var(--background-primary)',
                border: '1px solid var(--border-primary)',
                color: 'var(--foreground)',
              }}
            />
          </div>

          {/* Active Checkbox */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-5 h-5 rounded"
              style={{
                accentColor: 'var(--accent-primary)',
              }}
            />
            <label htmlFor="isActive" className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
              Active (fetch articles from this source)
            </label>
          </div>

          {formErrors.submit && (
            <p className="text-sm" style={{ color: 'var(--color-error)' }}>
              {formErrors.submit}
            </p>
          )}
        </form>
      </Modal>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Search and Filter */}
        <div className="flex items-center gap-3 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
              style={{ color: 'var(--text-tertiary)' }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sources..."
              className="w-full pl-11 pr-4 py-2.5 rounded-lg font-medium"
              style={{
                background: 'var(--background-elevated)',
                border: '1px solid var(--border-primary)',
                color: 'var(--foreground)',
              }}
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2.5 rounded-lg font-medium"
            style={{
              background: 'var(--background-elevated)',
              border: '1px solid var(--border-primary)',
              color: 'var(--foreground)',
            }}
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* View Toggle */}
        <div
          className="flex items-center rounded-lg p-1"
          style={{
            background: 'var(--background-elevated)',
            border: '1px solid var(--border-primary)',
          }}
        >
          <button
            onClick={() => setViewMode('card')}
            className={`px-3 py-2 rounded-md transition-colors ${
              viewMode === 'card' ? '' : ''
            }`}
            style={{
              background: viewMode === 'card' ? 'var(--accent-primary)' : 'transparent',
              color: viewMode === 'card' ? 'white' : 'var(--text-secondary)',
            }}
          >
            <Grid3x3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-2 rounded-md transition-colors ${
              viewMode === 'table' ? '' : ''
            }`}
            style={{
              background: viewMode === 'table' ? 'var(--accent-primary)' : 'transparent',
              color: viewMode === 'table' ? 'white' : 'var(--text-secondary)',
            }}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sources List/Table */}
      {filteredSources.length === 0 ? (
        <div
          className="text-center py-16 rounded-lg"
          style={{
            background: 'var(--background-elevated)',
            border: '1px solid var(--border-primary)',
          }}
        >
          <p className="text-lg mb-2" style={{ color: 'var(--text-secondary)' }}>
            {searchQuery || selectedCategory !== 'all'
              ? 'No sources match your filters'
              : 'No RSS sources configured yet'}
          </p>
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
            Click &ldquo;Add Source&rdquo; to get started
          </p>
        </div>
      ) : viewMode === 'card' ? (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredSources.map((source) => (
            <div
              key={source.id}
              className="p-4 rounded-lg transition-all group"
              style={{
                background: 'var(--background-elevated)',
                border: '1px solid var(--border-primary)',
              }}
            >
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={selectedSources.has(source.id)}
                  onChange={() => toggleSelectSource(source.id)}
                  className="w-5 h-5 rounded mt-1"
                  style={{ accentColor: 'var(--accent-primary)' }}
                />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {getStatusIcon(source)}
                      <h4 className="font-bold truncate" style={{ color: 'var(--foreground)' }}>
                        {source.name}
                      </h4>
                    </div>
                    <Badge variant={source.isActive ? 'success' : 'secondary'} size="sm">
                      {source.isActive ? 'Active' : 'Disabled'}
                    </Badge>
                  </div>

                  <div className="space-y-1 text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">URL:</span>
                      <a
                        href={source.rssUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate hover:underline flex items-center gap-1"
                        style={{ color: 'var(--accent-primary)' }}
                      >
                        {source.rssUrl.substring(0, 40)}...
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </a>
                    </div>
                    <div>
                      <span className="font-medium">Category:</span> {source.category}
                      {source.subcategory && ` / ${source.subcategory}`}
                    </div>
                    {source.description && (
                      <p className="text-xs line-clamp-1">{source.description}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <IconButton
                      icon={<Power className="w-4 h-4" />}
                      onClick={() => handleToggleActive(source)}
                      variant={source.isActive ? 'primary' : 'secondary'}
                      size="sm"
                      aria-label={source.isActive ? 'Disable source' : 'Enable source'}
                      title={source.isActive ? 'Disable source' : 'Enable source'}
                    />
                    {onTestSource && (
                      <IconButton
                        icon={
                          testingSourceId === source.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )
                        }
                        onClick={() => handleTestFeed(source.rssUrl, source.id)}
                        variant="secondary"
                        size="sm"
                        aria-label="Test RSS feed"
                        title="Test RSS feed"
                        disabled={testingSourceId === source.id}
                      />
                    )}
                    <IconButton
                      icon={<Edit2 className="w-4 h-4" />}
                      onClick={() => handleEdit(source)}
                      variant="secondary"
                      size="sm"
                      aria-label="Edit source"
                      title="Edit source"
                    />
                    <IconButton
                      icon={<Trash2 className="w-4 h-4" />}
                      onClick={() => setDeleteConfirmId(source.id)}
                      variant="ghost"
                      size="sm"
                      aria-label="Delete source"
                      title="Delete source"
                      style={{ color: 'var(--color-error)' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="rounded-lg overflow-hidden"
          style={{
            background: 'var(--background-elevated)',
            border: '1px solid var(--border-primary)',
          }}
        >
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--background-subtle)', borderBottom: '1px solid var(--border-primary)' }}>
                <th className="p-4 text-left">
                  <input
                    type="checkbox"
                    checked={
                      filteredSources.length > 0 &&
                      selectedSources.size === filteredSources.length
                    }
                    onChange={toggleSelectAll}
                    className="w-5 h-5 rounded"
                    style={{ accentColor: 'var(--accent-primary)' }}
                  />
                </th>
                <th className="p-4 text-left font-semibold" style={{ color: 'var(--foreground)' }}>Status</th>
                <th className="p-4 text-left font-semibold" style={{ color: 'var(--foreground)' }}>Name</th>
                <th className="p-4 text-left font-semibold" style={{ color: 'var(--foreground)' }}>Category</th>
                <th className="p-4 text-left font-semibold" style={{ color: 'var(--foreground)' }}>URL</th>
                <th className="p-4 text-right font-semibold" style={{ color: 'var(--foreground)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSources.map((source, index) => (
                <tr
                  key={source.id}
                  style={{
                    borderBottom: index < filteredSources.length - 1 ? '1px solid var(--border-primary)' : 'none',
                  }}
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedSources.has(source.id)}
                      onChange={() => toggleSelectSource(source.id)}
                      className="w-5 h-5 rounded"
                      style={{ accentColor: 'var(--accent-primary)' }}
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(source)}
                      <Badge variant={source.isActive ? 'success' : 'secondary'} size="sm">
                        {source.isActive ? 'Active' : 'Disabled'}
                      </Badge>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold" style={{ color: 'var(--foreground)' }}>
                      {source.name}
                    </div>
                    {source.description && (
                      <div className="text-xs mt-1 line-clamp-1" style={{ color: 'var(--text-tertiary)' }}>
                        {source.description}
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {source.category}
                    </div>
                    {source.subcategory && (
                      <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                        {source.subcategory}
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <a
                      href={source.rssUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm truncate hover:underline flex items-center gap-1 max-w-xs"
                      style={{ color: 'var(--accent-primary)' }}
                    >
                      {source.rssUrl.substring(0, 40)}...
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      <IconButton
                        icon={<Power className="w-4 h-4" />}
                        onClick={() => handleToggleActive(source)}
                        variant={source.isActive ? 'primary' : 'secondary'}
                        size="sm"
                        aria-label={source.isActive ? 'Disable source' : 'Enable source'}
                        title={source.isActive ? 'Disable' : 'Enable'}
                      />
                      <IconButton
                        icon={<Edit2 className="w-4 h-4" />}
                        onClick={() => handleEdit(source)}
                        variant="ghost"
                        size="sm"
                        aria-label="Edit source"
                        title="Edit"
                      />
                      <IconButton
                        icon={<Trash2 className="w-4 h-4" />}
                        onClick={() => setDeleteConfirmId(source.id)}
                        variant="ghost"
                        size="sm"
                        aria-label="Delete source"
                        title="Delete"
                        style={{ color: 'var(--color-error)' }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={() => deleteConfirmId && handleDelete(deleteConfirmId)}
        title="Delete RSS Source"
        message="Are you sure you want to delete this source? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />

      {/* Bulk Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={bulkDeleteConfirm}
        onClose={() => setBulkDeleteConfirm(false)}
        onConfirm={handleBulkDelete}
        title="Delete Multiple Sources"
        message={`Are you sure you want to delete ${selectedSources.size} source${selectedSources.size !== 1 ? 's' : ''}? This action cannot be undone.`}
        confirmText="Delete All"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
