'use client';

import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, Filter, Globe } from 'lucide-react';
import InternationalSourceCard from '@/components/InternationalSourceCard';
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
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Globe size={32} className="text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">International News Outlets</h1>
          </div>
          <p className="text-gray-600">
            Access news from around the world - {filteredOutlets.length} outlets available
          </p>
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by outlet name, country, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            <Filter size={16} />
            <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
            {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Language Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Outlets Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredOutlets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No outlets found matching your criteria.</p>
            <button
              onClick={clearFilters}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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
                <div key={region.name} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {/* Region Header */}
                  <button
                    onClick={() => toggleRegion(region.name)}
                    className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-blue-50 to-white hover:from-blue-100 hover:to-blue-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-semibold text-gray-900">{region.name}</h2>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
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
                            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                              <span className="text-2xl">{country.flag}</span>
                              <span>{country.name}</span>
                              <span className="text-sm text-gray-500 font-normal">
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
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
