/**
 * Navigation Component
 * Auto-hide sticky header with scroll behavior
 * Hides on scroll down, appears on scroll up
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Newspaper, Search, Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { getAllCategories } from '@/lib/category-utils';

export default function Navigation() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const categories = getAllCategories();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show nav when scrolling up, hide when scrolling down
      // Always show if at top of page
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & past 100px
        setIsVisible(false);
        setIsMobileMenuOpen(false); // Close mobile menu when hiding
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <nav
      className={`nav-header ${isVisible ? 'visible' : 'hidden'}`}
      style={{
        height: '64px',
      }}
    >
      <div className="container">
        <div className="flex-between" style={{ height: '64px' }}>
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-2 group">
            <Newspaper className="w-6 h-6 transition-colors group-hover:text-[var(--accent-primary)]" />
            <span className="text-xl font-bold">NewsHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {/* Quick Category Links */}
            <div className="flex items-center gap-4">
              {categories.slice(0, 4).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="text-sm font-medium text-secondary hover:text-foreground transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            {/* Divider */}
            <div
              className="h-6 w-px"
              style={{ background: 'var(--border)' }}
            />

            {/* Search Link */}
            <Link
              href="/search"
              className="btn-ghost btn-icon"
              aria-label="Search"
              title="Search articles"
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="btn-ghost btn-icon"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden absolute left-0 right-0 top-full border-t"
            style={{
              background: 'var(--background-elevated)',
              borderColor: 'var(--border)',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div className="container py-4">
              {/* All Categories */}
              <div className="space-y-2 mb-4">
                <h3 className="text-xs font-bold uppercase text-muted mb-2">
                  Categories
                </h3>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    className="block py-2 px-3 rounded-md hover:bg-[var(--background-hover)] transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>

              {/* Search & Other Links */}
              <div
                className="pt-4 border-t space-y-2"
                style={{ borderColor: 'var(--border)' }}
              >
                <Link
                  href="/search"
                  className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-[var(--background-hover)] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </Link>
                <Link
                  href="/daily-brief"
                  className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-[var(--background-hover)] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Newspaper className="w-4 h-4" />
                  <span>Daily Brief</span>
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-[var(--background-hover)] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>Settings</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
