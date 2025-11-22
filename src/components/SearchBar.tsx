/**
 * SearchBar Component - V2.0
 * Enhanced search with auto-complete, recent searches, and CMD+K shortcut
 * Features: localStorage recent searches, beautiful dropdown, keyboard navigation
 */

'use client';

import { useState, useEffect, useRef, KeyboardEvent, ChangeEvent } from 'react';
import { Search, X, Loader2, Command, Clock, TrendingUp, Hash } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  initialQuery?: string;
  suggestions?: string[];
  trendingTopics?: string[];
  onSearch?: (query: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  showShortcut?: boolean;
  className?: string;
  variant?: 'default' | 'hero';
}

const MAX_RECENT_SEARCHES = 5;
const RECENT_SEARCHES_KEY = 'newshub_recent_searches';

export default function SearchBar({
  initialQuery = '',
  suggestions = [],
  trendingTopics = [],
  onSearch,
  placeholder = 'Search news articles...',
  autoFocus = false,
  showShortcut = true,
  className = '',
  variant = 'default',
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading recent searches:', error);
      }
    }
  }, []);

  // Keyboard shortcut (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setShowDropdown(true);
      }
      // ESC to close
      if (e.key === 'Escape') {
        setShowDropdown(false);
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-focus if requested
  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
      setShowDropdown(true);
    }
  }, [autoFocus]);

  // Save search to recent searches
  const saveRecentSearch = (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    // Remove duplicate and add to front
    const updated = [trimmed, ...recentSearches.filter((s) => s !== trimmed)].slice(
      0,
      MAX_RECENT_SEARCHES
    );
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  // Handle input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
    setShowDropdown(true);
  };

  // Handle search submission
  const handleSearch = async (searchQuery?: string) => {
    const finalQuery = searchQuery || query;

    if (!finalQuery.trim()) return;

    setIsLoading(true);
    setShowDropdown(false);

    // Save to recent searches
    saveRecentSearch(finalQuery);

    try {
      if (onSearch) {
        onSearch(finalQuery);
      } else {
        // Navigate to search results page
        router.push(`/search?q=${encodeURIComponent(finalQuery)}`);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get all dropdown items for keyboard navigation
  const getDropdownItems = () => {
    const items: { type: string; value: string }[] = [];

    if (query.trim()) {
      // Add matching suggestions
      const matching = suggestions.filter((s) =>
        s.toLowerCase().includes(query.toLowerCase())
      );
      matching.forEach((s) => items.push({ type: 'suggestion', value: s }));
    } else {
      // Show recent searches if no query
      recentSearches.forEach((s) => items.push({ type: 'recent', value: s }));

      // Show trending topics
      trendingTopics.forEach((t) => items.push({ type: 'trending', value: t }));
    }

    return items;
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const items = getDropdownItems();

    if (!showDropdown || items.length === 0) {
      if (e.key === 'Enter') {
        handleSearch();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < items.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < items.length) {
          handleSearch(items[selectedIndex].value);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Handle clear button
  const handleClear = () => {
    setQuery('');
    setSelectedIndex(-1);
    inputRef.current?.focus();
    setShowDropdown(true);
  };

  // Handle item click
  const handleItemClick = (value: string) => {
    setQuery(value);
    handleSearch(value);
  };

  // Handle clicks outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const dropdownItems = getDropdownItems();
  const hasRecentSearches = !query.trim() && recentSearches.length > 0;
  const hasTrendingTopics = !query.trim() && trendingTopics.length > 0;
  const hasSuggestions = query.trim() && dropdownItems.some((i) => i.type === 'suggestion');

  // Hero variant (larger, more prominent)
  const inputClasses =
    variant === 'hero'
      ? 'w-full pl-14 pr-32 py-5 text-lg rounded-xl'
      : 'w-full pl-12 pr-24 py-3 text-base rounded-lg';

  const iconSize = variant === 'hero' ? 'w-6 h-6' : 'w-5 h-5';

  return (
    <div className={`relative w-full ${variant === 'hero' ? 'max-w-3xl' : 'max-w-2xl'} ${className}`}>
      {/* Search Input Container */}
      <div className="relative">
        {/* Search Icon */}
        <div
          className={`absolute ${variant === 'hero' ? 'left-5' : 'left-4'} top-1/2 -translate-y-1/2`}
          style={{ color: 'var(--text-tertiary)' }}
        >
          {isLoading ? (
            <Loader2 className={`${iconSize} animate-spin`} />
          ) : (
            <Search className={iconSize} />
          )}
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`${inputClasses} font-medium transition-all`}
          style={{
            background: 'var(--background-elevated)',
            border: '2px solid var(--border-primary)',
            color: 'var(--foreground)',
            outline: 'none',
          }}
          onFocus={(e) => {
            setShowDropdown(true);
            e.target.style.borderColor = 'var(--accent-primary)';
            e.target.style.boxShadow = 'var(--shadow-focus)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--border-primary)';
            e.target.style.boxShadow = 'none';
          }}
          aria-label="Search articles"
          aria-expanded={showDropdown}
          aria-controls="search-dropdown"
          autoComplete="off"
        />

        {/* Right Side Icons */}
        <div
          className={`absolute ${variant === 'hero' ? 'right-3' : 'right-2'} top-1/2 -translate-y-1/2 flex items-center gap-2`}
        >
          {/* Clear Button */}
          {query && (
            <button
              onClick={handleClear}
              className="p-2 rounded-md transition-colors hover:bg-[var(--background-subtle)]"
              aria-label="Clear search"
              type="button"
            >
              <X className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
            </button>
          )}

          {/* Keyboard Shortcut Indicator */}
          {showShortcut && !query && (
            <div
              className="hidden sm:flex items-center gap-1 px-2 py-1 rounded text-xs font-medium"
              style={{
                background: 'var(--background-subtle)',
                color: 'var(--text-tertiary)',
              }}
            >
              <Command className="w-3 h-3" />
              <span>K</span>
            </div>
          )}
        </div>
      </div>

      {/* Dropdown */}
      {showDropdown && dropdownItems.length > 0 && (
        <div
          ref={dropdownRef}
          id="search-dropdown"
          className="absolute z-50 w-full mt-2 rounded-lg shadow-xl max-h-96 overflow-y-auto animate-scale-in"
          style={{
            background: 'var(--background-elevated)',
            border: '1px solid var(--border-primary)',
          }}
        >
          {/* Recent Searches Section */}
          {hasRecentSearches && (
            <div className="p-3 border-b" style={{ borderColor: 'var(--border-primary)' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
                  <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
                    Recent Searches
                  </span>
                </div>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs font-medium hover:underline"
                  style={{ color: 'var(--accent-primary)' }}
                  type="button"
                >
                  Clear
                </button>
              </div>
              <div className="space-y-1">
                {recentSearches.map((item, index) => {
                  const isSelected =
                    selectedIndex ===
                    dropdownItems.findIndex((d) => d.type === 'recent' && d.value === item);
                  return (
                    <button
                      key={`recent-${index}`}
                      onClick={() => handleItemClick(item)}
                      className="w-full px-3 py-2 text-left rounded-md transition-colors flex items-center gap-3"
                      style={{
                        background: isSelected ? 'var(--background-subtle)' : 'transparent',
                        color: 'var(--foreground)',
                      }}
                      onMouseEnter={() =>
                        setSelectedIndex(
                          dropdownItems.findIndex(
                            (d) => d.type === 'recent' && d.value === item
                          )
                        )
                      }
                      type="button"
                    >
                      <Clock className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-tertiary)' }} />
                      <span className="text-sm">{item}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Suggestions Section */}
          {hasSuggestions && (
            <div className="p-3 border-b" style={{ borderColor: 'var(--border-primary)' }}>
              <div className="flex items-center gap-2 mb-2">
                <Search className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
                  Suggestions
                </span>
              </div>
              <div className="space-y-1">
                {dropdownItems
                  .filter((item) => item.type === 'suggestion')
                  .map((item, index) => {
                    const globalIndex = dropdownItems.indexOf(item);
                    const isSelected = selectedIndex === globalIndex;
                    return (
                      <button
                        key={`suggestion-${index}`}
                        onClick={() => handleItemClick(item.value)}
                        className="w-full px-3 py-2 text-left rounded-md transition-colors flex items-center gap-3"
                        style={{
                          background: isSelected ? 'var(--background-subtle)' : 'transparent',
                          color: 'var(--foreground)',
                        }}
                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                        type="button"
                      >
                        <Search className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-tertiary)' }} />
                        <span className="text-sm">{item.value}</span>
                      </button>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Trending Topics Section */}
          {hasTrendingTopics && (
            <div className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
                  Trending Topics
                </span>
              </div>
              <div className="space-y-1">
                {trendingTopics.map((topic, index) => {
                  const isSelected =
                    selectedIndex ===
                    dropdownItems.findIndex((d) => d.type === 'trending' && d.value === topic);
                  return (
                    <button
                      key={`trending-${index}`}
                      onClick={() => handleItemClick(topic)}
                      className="w-full px-3 py-2 text-left rounded-md transition-colors flex items-center gap-3"
                      style={{
                        background: isSelected ? 'var(--background-subtle)' : 'transparent',
                        color: 'var(--foreground)',
                      }}
                      onMouseEnter={() =>
                        setSelectedIndex(
                          dropdownItems.findIndex(
                            (d) => d.type === 'trending' && d.value === topic
                          )
                        )
                      }
                      type="button"
                    >
                      <Hash className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent-primary)' }} />
                      <span className="text-sm font-medium">{topic}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Footer Hint */}
          <div
            className="px-3 py-2 text-xs border-t"
            style={{
              background: 'var(--background-subtle)',
              color: 'var(--text-tertiary)',
              borderColor: 'var(--border-primary)',
            }}
          >
            <div className="flex items-center justify-between">
              <span>Press Enter to search</span>
              <span>ESC to close</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
