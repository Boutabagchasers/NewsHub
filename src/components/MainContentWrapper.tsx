/**
 * Main Content Wrapper
 * Adjusts content padding based on sidebar state
 */

'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { useSidebar } from '@/contexts/SidebarContext';
import ThemeToggle from './ThemeToggle';

export default function MainContentWrapper({ children }: { children: ReactNode }) {
  const { isOpen } = useSidebar();

  return (
    <div
      className="transition-all duration-300 ease-in-out"
      style={{
        paddingLeft: isOpen ? '280px' : '0',
      }}
    >
      {/* Top Header Bar (for theme toggle and quick actions) */}
      <header
        className="sticky top-0 z-30 h-16 border-b flex items-center justify-between px-6 transition-all duration-300"
        style={{
          background: 'var(--background-elevated)',
          borderColor: 'var(--border)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">
            Welcome back
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </header>

      {/* Page Content */}
      <main id="main-content" className="min-h-screen">
        {children}
      </main>

      {/* Footer */}
      <footer
        className="border-t py-8 transition-all duration-300"
        style={{
          borderColor: 'var(--border)',
          background: 'var(--background-subtle)'
        }}
      >
        <div className="container max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-6">
            <div>
              <h3 className="font-bold mb-3">About NewsHub</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Your trusted source for global news, aggregating articles from leading sources worldwide.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                <li><Link href="/" className="hover:text-[var(--accent-primary)] transition-colors">Home</Link></li>
                <li><Link href="/daily-brief" className="hover:text-[var(--accent-primary)] transition-colors">Daily Brief</Link></li>
                <li><Link href="/international" className="hover:text-[var(--accent-primary)] transition-colors">International</Link></li>
                <li><Link href="/settings" className="hover:text-[var(--accent-primary)] transition-colors">Settings</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-3">Connect</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-2">
                Stay updated with the latest news and platform updates.
              </p>
              <a
                href="https://github.com/jssihota/NewsHub"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--accent-primary)] hover:underline"
              >
                View on GitHub
              </a>
            </div>
          </div>
          <div
            className="pt-6 border-t text-center text-sm text-[var(--text-muted)]"
            style={{ borderColor: 'var(--border)' }}
          >
            <p>&copy; 2025 Joel Sihota. All rights reserved. NewsHub v1.0.4</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
