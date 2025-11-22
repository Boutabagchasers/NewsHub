'use client';

import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, Filter, Globe } from 'lucide-react';
import InternationalSourceCard from '@/components/InternationalSourceCard';
import { Card, CardContent } from '@/components/ui/card';
import {
  searchInternationalSources,
  getAvailableLanguages,
  getAvailableCategories,
  getAllSources,
  InternationalSourcesData,
} from '@/lib/international-utils';

// Import the international sources data
import internationalSourcesData from '@/data/international-sources.json';

/**
 * International News Directory Page
 *
 * Displays international news outlets organized by region with:
 * - Search functionality
 * - Filter by language and category
 * - Collapsible region sections
 * - Favorite outlets management
 */
export default function InternationalPage() {
  const data = internationalSourcesData as InternationalSourcesData;

  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [expandedRegions, setExpandedRegions] = useState<Set<string>>(new Set(['Asia']));
  const [favoriteOutlets, setFavoriteOutlets] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  // Get available languages and categories
  const availableLanguages = useMemo(() => getAvailableLanguages(data), [data]);
  const availableCategories = useMemo(() => getAvailableCategories(data), [data]);

  // Filter and search outlets
  const filteredOutlets = useMemo(() => {
    let results = getAllSources(data);

    // Apply search
    if (searchQuery.trim()) {
      results = searchInternationalSources(data, searchQuery);
    }

    // Apply language filter
    if (selectedLanguage) {
      results = results.filter((outlet) => outlet.language === selectedLanguage);
    }

    // Apply category filter
    if (selectedCategory) {
      results = results.filter((outlet) => outlet.category === selectedCategory);
    }

    return results;
  }, [data, searchQuery, selectedLanguage, selectedCategory]);

  // Group filtered outlets by region
  const outletsByRegion = useMemo(() => {
    const grouped: Record<string, typeof filteredOutlets> = {};

    filteredOutlets.forEach((outlet) => {
      if (!grouped[outlet.region]) {
        grouped[outlet.region] = [];
      }
      grouped[outlet.region].push(outlet);
    });

    return grouped;
  }, [filteredOutlets]);

  // Toggle region expansion
  const toggleRegion = (regionName: string) => {
    setExpandedRegions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(regionName)) {
        newSet.delete(regionName);
      } else {
        newSet.add(regionName);
      }
      return newSet;
    });
  };

  // Toggle favorite outlet
  const toggleFavorite = (outletName: string) => {
    setFavoriteOutlets((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(outletName)) {
        newSet.delete(outletName);
      } else {
        newSet.add(outletName);
      }
      return newSet;
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedLanguage('');
    setSelectedCategory('');
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--background-subtle)' }}>
      {/* Header Section */}
      <div
        style={{
          background: 'var(--background-elevated)',
          borderBottom: '1px solid var(--border-primary)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Globe size={32} style={{ color: 'var(--accent-primary)' }} />
            <h1 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>
              International News Outlets
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>
            Access news from around the world - {filteredOutlets.length} outlets available
          </p>
        </div>
      </div>

      {/* Search and Filters Section */}
      <div
        style={{
          background: 'var(--background-elevated)',
          borderBottom: '1px solid var(--border-primary)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
              size={20}
              style={{ color: 'var(--text-tertiary)' }}
            />
            <input
              type="text"
              placeholder="Search by outlet name, country, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg focus:ring-2 transition-all"
              style={{
                border: '1px solid var(--border-primary)',
                background: 'var(--background-primary)',
                color: 'var(--foreground)'
              }}
            />
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors"
            style={{
              background: 'var(--background-subtle)',
              color: 'var(--text-primary)'
            }}
          >
            <Filter size={16} />
            <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
            {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {/* Filter Options */}
          {showFilters && (
            <Card variant="default" padding="lg" className="mt-4">
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Language Filter */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                      Language
                    </label>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="w-full px-3 py-2 rounded-md focus:ring-2 transition-all"
                      style={{
                        border: '1px solid var(--border-primary)',
                        background: 'var(--background-primary)',
                        color: 'var(--foreground)'
                      }}
                    >
                      <option value="">All Languages</option>
                      {availableLanguages.map((language) => (
                        <option key={language} value={language}>
                          {language}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-md focus:ring-2 transition-all"
                      style={{
                        border: '1px solid var(--border-primary)',
                        background: 'var(--background-primary)',
                        color: 'var(--foreground)'
                      }}
                    >
                      <option value="">All Categories</option>
                      {availableCategories.map((category) => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Clear Filters Button */}
                {(searchQuery || selectedLanguage || selectedCategory) && (
                  <div className="mt-4">
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 text-sm font-medium"
                      style={{ color: 'var(--accent-primary)' }}
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Outlets Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredOutlets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg mb-4" style={{ color: 'var(--text-secondary)' }}>
              No outlets found matching your criteria.
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 rounded-md transition-colors"
              style={{
                background: 'var(--accent-primary)',
                color: 'white'
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Organize by Region */}
            {data.regions.map((region) => {
              const regionOutlets = outletsByRegion[region.name] || [];
              if (regionOutlets.length === 0) return null;

              const isExpanded = expandedRegions.has(region.name);

              return (
                <Card key={region.name} variant="elevated" padding="none" className="overflow-hidden">
                  {/* Region Header */}
                  <button
                    onClick={() => toggleRegion(region.name)}
                    className="w-full px-6 py-4 flex items-center justify-between transition-colors"
                    style={{
                      background: 'linear-gradient(to right, var(--background-subtle), var(--background-elevated))'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>
                        {region.name}
                      </h2>
                      <span
                        className="px-3 py-1 text-sm font-medium rounded-full"
                        style={{
                          background: 'var(--accent-primary)',
                          color: 'white'
                        }}
                      >
                        {regionOutlets.length} {regionOutlets.length === 1 ? 'outlet' : 'outlets'}
                      </span>
                    </div>
                    {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                  </button>

                  {/* Region Content */}
                  {isExpanded && (
                    <div className="p-6">
                      {/* Group by country within region */}
                      {region.countries.map((country) => {
                        const countryOutlets = regionOutlets.filter(
                          (o) => o.countryCode === country.code
                        );
                        if (countryOutlets.length === 0) return null;

                        return (
                          <div key={country.code} className="mb-6 last:mb-0">
                            <h3 className="text-lg font-medium mb-4 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                              <span className="text-2xl">{country.flag}</span>
                              <span>{country.name}</span>
                              <span className="text-sm font-normal" style={{ color: 'var(--text-tertiary)' }}>
                                ({countryOutlets.length})
                              </span>
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {countryOutlets.map((outlet) => (
                                <InternationalSourceCard
                                  key={outlet.name}
                                  outlet={outlet}
                                  country={outlet.country}
                                  countryFlag={outlet.countryFlag}
                                  isFavorite={favoriteOutlets.has(outlet.name)}
                                  onToggleFavorite={toggleFavorite}
                                />
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
