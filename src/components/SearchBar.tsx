'use client';

/**
 * SearchBar Component
 * A prominent search input with keyboard shortcuts, suggestions, and loading states
 */

import { useState, useEffect, useRef, KeyboardEvent, ChangeEvent } from 'react';
import { Search, X, Loader2, Command } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  initialQuery?: string;
  suggestions?: string[];
  onSearch?: (query: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  showShortcut?: boolean;
  className?: string;
}

export default function SearchBar({
  initialQuery = '',
  suggestions = [],
  onSearch,
  placeholder = 'Search news articles...',
  autoFocus = false,
  showShortcut = true,
  className = '',
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Keyboard shortcut (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-focus if requested
  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  // Handle input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedSuggestionIndex(-1);

    if (value.trim().length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // Handle search submission
  const handleSearch = async (searchQuery?: string) => {
    const finalQuery = searchQuery || query;

    if (!finalQuery.trim()) return;

    setIsLoading(true);
    setShowSuggestions(false);

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

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSearch();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleSearch(suggestions[selectedSuggestionIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle clear button
  const handleClear = () => {
    setQuery('');
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    inputRef.current?.focus();
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  // Handle clicks outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative w-full max-w-2xl ${className}`}>
      {/* Search Input Container */}
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setShowSuggestions(true)}
          placeholder={placeholder}
          className="w-full pl-12 pr-24 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-sky-blue transition-all"
          aria-label="Search articles"
          autoComplete="off"
        />

        {/* Right Side Icons */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {/* Clear Button */}
          {query && (
            <button
              onClick={handleClear}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Clear search"
              type="button"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}

          {/* Keyboard Shortcut Indicator */}
          {showShortcut && !query && (
            <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs text-gray-500">
              <Command className="w-3 h-3" />
              <span>K</span>
            </div>
          )}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-2 bg-background-elevated border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`w-full px-4 py-2 text-left hover:bg-sky-blue transition-colors ${
                index === selectedSuggestionIndex
                  ? 'bg-sky-blue'
                  : ''
              }`}
              type="button"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700">
                  {suggestion}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
