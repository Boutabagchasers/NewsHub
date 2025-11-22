/**
 * Sidebar Component
 * Professional sidebar navigation with categories, dashboard, and quick actions
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Newspaper,
  Search,
  Settings,
  TrendingUp,
  Globe,
  Zap,
  BarChart3,
  BookOpen,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  User,
  Bell,
  Star,
  Clock,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { getAllCategories } from '@/lib/category-utils';
import { useSidebar } from '@/contexts/SidebarContext';
import type { Article } from '@/types';

interface NavLinkProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badge?: string;
}

interface CategoryLinkProps {
  href: string;
  label: string;
}

export default function Sidebar() {
  const { isOpen, toggleSidebar } = useSidebar();
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);
  const [stats, setStats] = useState({ articles: 0, sources: 0, categories: 8 });
  const pathname = usePathname();
  const categories = getAllCategories();

  // Fetch stats on mount
  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/articles');
        const data = await response.json();
        if (data.articles) {
          setStats({
            articles: data.articles.length,
            sources: new Set(data.articles.map((a: Article) => a.source)).size,
            categories: 8,
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    }
    fetchStats();
  }, []);

  // No need to close on route change since sidebar shifts content

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  const NavLink = ({ href, icon: Icon, label, badge }: NavLinkProps) => {
    const active = isActive(href);
    return (
      <Link
        href={href}
        className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
          active
            ? 'bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white shadow-md'
            : 'hover:bg-[var(--background-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
        }`}
        aria-current={active ? 'page' : undefined}
        aria-label={badge ? `${label} - ${badge}` : label}
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
          <span className="font-medium">{label}</span>
        </div>
        {badge && (
          <span
            className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
              active
                ? 'bg-white/20 text-white'
                : 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]'
            }`}
            role="status"
            aria-label={`Badge: ${badge}`}
          >
            {badge}
          </span>
        )}
      </Link>
    );
  };

  const CategoryLink = ({ href, label }: CategoryLinkProps) => {
    const active = isActive(href);
    return (
      <Link
        href={href}
        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-all duration-200 ${
          active
            ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] font-medium'
            : 'text-[var(--text-secondary)] hover:bg-[var(--background-hover)] hover:text-[var(--text-primary)]'
        }`}
        aria-current={active ? 'page' : undefined}
        aria-label={`${label} category`}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60" aria-hidden="true" />
        {label}
      </Link>
    );
  };

  const SidebarContent = () => (
    <>
      {/* Logo/Brand Section */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border)' }}>
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <Newspaper className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">NewsHub</h1>
            <p className="text-xs text-[var(--text-muted)]">Global News Platform</p>
          </div>
        </Link>
      </div>

      {/* Dashboard Stats */}
      <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }} role="region" aria-label="Dashboard statistics">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3 px-2">
          Dashboard
        </h2>
        <div className="grid grid-cols-3 gap-2">
          <div className="card p-3 text-center" role="status" aria-label={`${stats.articles} articles available`}>
            <BarChart3 className="w-4 h-4 mx-auto mb-1 text-[var(--accent-primary)]" aria-hidden="true" />
            <div className="text-lg font-bold" aria-hidden="true">{stats.articles}</div>
            <div className="text-xs text-[var(--text-muted)]" aria-hidden="true">Articles</div>
          </div>
          <div className="card p-3 text-center" role="status" aria-label={`${stats.sources} news sources`}>
            <Globe className="w-4 h-4 mx-auto mb-1 text-[var(--accent-secondary)]" aria-hidden="true" />
            <div className="text-lg font-bold" aria-hidden="true">{stats.sources}</div>
            <div className="text-xs text-[var(--text-muted)]" aria-hidden="true">Sources</div>
          </div>
          <div className="card p-3 text-center" role="status" aria-label={`${stats.categories} topics covered`}>
            <Zap className="w-4 h-4 mx-auto mb-1 text-[var(--accent-primary)]" aria-hidden="true" />
            <div className="text-lg font-bold" aria-hidden="true">{stats.categories}</div>
            <div className="text-xs text-[var(--text-muted)]" aria-hidden="true">Topics</div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="p-4 border-b" style={{ borderColor: 'var(--border)' }} aria-label="Main navigation">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3 px-2">
          Navigation
        </h2>
        <div className="space-y-1" role="list">
          <NavLink href="/" icon={Home} label="Home" />
          <NavLink href="/daily-brief" icon={BookOpen} label="Daily Brief" badge="New" />
          <NavLink href="/search" icon={Search} label="Search" />
          <NavLink href="/international" icon={Globe} label="International" />
        </div>
      </nav>

      {/* Categories Section */}
      <nav className="p-4 border-b" style={{ borderColor: 'var(--border)' }} aria-label="News categories">
        <button
          onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
          className="flex items-center justify-between w-full px-2 mb-2 group"
          aria-expanded={isCategoriesOpen}
          aria-controls="categories-list"
          aria-label={`${isCategoriesOpen ? 'Collapse' : 'Expand'} categories menu`}
        >
          <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Categories
          </h2>
          {isCategoriesOpen ? (
            <ChevronDown className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-colors" aria-hidden="true" />
          ) : (
            <ChevronRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-colors" aria-hidden="true" />
          )}
        </button>
        {isCategoriesOpen && (
          <div
            id="categories-list"
            className="space-y-0.5 max-h-[300px] overflow-y-auto custom-scrollbar"
            role="list"
          >
            {categories.map((cat) => (
              <CategoryLink key={cat.id} href={`/category/${cat.slug}`} label={cat.name} />
            ))}
          </div>
        )}
      </nav>

      {/* Quick Actions */}
      <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }} role="region" aria-label="Quick actions">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3 px-2">
          Quick Actions
        </h2>
        <div className="space-y-1">
          <button
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm hover:bg-[var(--background-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
            aria-label="View saved articles (0 saved)"
          >
            <Star className="w-4 h-4" aria-hidden="true" />
            <span>Saved Articles</span>
            <span className="ml-auto text-xs text-[var(--text-muted)]" aria-label="0 saved">0</span>
          </button>
          <button
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm hover:bg-[var(--background-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
            aria-label="View reading history"
          >
            <Clock className="w-4 h-4" aria-hidden="true" />
            <span>Reading History</span>
          </button>
          <button
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm hover:bg-[var(--background-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
            aria-label="View trending articles"
          >
            <TrendingUp className="w-4 h-4" aria-hidden="true" />
            <span>Trending Now</span>
          </button>
        </div>
      </div>

      {/* Account Section */}
      <div className="p-4 mt-auto" role="region" aria-label="User account">
        <div className="space-y-1">
          <NavLink href="/settings" icon={Settings} label="Settings" />
          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--background-hover)] hover:text-[var(--text-primary)] transition-all"
            aria-label="View notifications (unread notifications available)"
          >
            <Bell className="w-5 h-5" aria-hidden="true" />
            <span className="font-medium">Notifications</span>
            <span className="ml-auto w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse" role="status" aria-label="Unread notifications" />
          </button>
          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--background-hover)] hover:text-[var(--text-primary)] transition-all"
            aria-label="Manage account"
          >
            <User className="w-5 h-5" aria-hidden="true" />
            <span className="font-medium">Account</span>
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="text-center">
          <p className="text-xs text-[var(--text-muted)] mb-1">NewsHub v1.0.4</p>
          <p className="text-xs text-[var(--text-muted)]">
            &copy; 2025 Joel Sihota
          </p>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Sidebar Toggle Button - Always visible */}
      <button
        onClick={toggleSidebar}
        className="fixed top-20 z-50 btn-primary w-10 h-10 rounded-r-lg flex items-center justify-center shadow-lg transition-all duration-300"
        style={{
          left: isOpen ? '280px' : '0',
        }}
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
        title={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className="fixed top-0 left-0 h-screen z-40 flex flex-col transition-all duration-300 ease-in-out"
        style={{
          width: '280px',
          transform: isOpen ? 'translateX(0)' : 'translateX(-280px)',
          background: 'var(--background-elevated)',
          borderRight: '1px solid var(--border)',
          boxShadow: isOpen ? 'var(--shadow-lg)' : 'none',
        }}
        aria-label="Main sidebar navigation"
        aria-hidden={!isOpen}
      >
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <SidebarContent />
        </div>
      </aside>
    </>
  );
}
