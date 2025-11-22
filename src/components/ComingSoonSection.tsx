/**
 * Coming Soon Section
 * Showcase upcoming features and enhancements
 * Dynamically imported to reduce initial bundle size
 */

'use client';

import { Smartphone, User, Sparkles } from 'lucide-react';
import Image from 'next/image';

export default function ComingSoonSection() {
  return (
    <section className="section-spacing" style={{ background: 'var(--background-subtle)' }}>
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="heading-section mb-4">Coming Soon</h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Exciting new features are on the way to make your news experience even better
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* iOS Widget */}
          <div className="card p-6 hover:shadow-xl transition-all">
            <div className="mb-4 h-48 rounded-lg overflow-hidden" style={{ background: 'var(--background-subtle)' }}>
              <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}>
                <Smartphone className="w-24 h-24 text-white opacity-80" />
              </div>
            </div>
            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3" style={{ background: 'var(--accent-primary)', color: 'white' }}>
              Coming Q1 2025
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>iOS Widget</h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Stay updated with top stories right on your iPhone home screen. Quick glance at breaking news without opening the app.
            </p>
          </div>

          {/* Personalization */}
          <div className="card p-6 hover:shadow-xl transition-all">
            <div className="mb-4 h-48 rounded-lg overflow-hidden" style={{ background: 'var(--background-subtle)' }}>
              <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent-secondary), var(--accent-primary))' }}>
                <User className="w-24 h-24 text-white opacity-80" />
              </div>
            </div>
            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3" style={{ background: 'var(--accent-secondary)', color: 'white' }}>
              Coming Q2 2025
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Personalization</h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Customize your news feed, save favorite sources, and get recommendations based on your reading habits.
            </p>
          </div>

          {/* AI Summaries */}
          <div className="card p-6 hover:shadow-xl transition-all">
            <div className="mb-4 h-48 rounded-lg overflow-hidden" style={{ background: 'var(--background-subtle)' }}>
              <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}>
                <Sparkles className="w-24 h-24 text-white opacity-80" />
              </div>
            </div>
            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3" style={{ background: 'var(--accent-primary)', color: 'white' }}>
              Coming Q3 2025
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>AI Summaries</h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Get concise AI-powered summaries of long articles. Save time while staying informed on complex topics.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
