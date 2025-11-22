/**
 * About NewsHub Section
 * Information about the platform's features and benefits
 * Dynamically imported to reduce initial bundle size
 */

'use client';

import { Shield, Zap, Grid3x3, Eye, Sparkles, Globe2 } from 'lucide-react';

export default function AboutSection() {
  return (
    <section className="section-spacing" style={{ background: 'var(--background-primary)' }}>
      <div className="container">
        {/* About NewsHub Header */}
        <div className="text-center mb-12">
          <h2 className="heading-section mb-4">About NewsHub</h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            NewsHub is your centralized platform for global news, bringing together stories from trusted sources worldwide.
          </p>
        </div>

        {/* What We Do */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-8 text-center" style={{ color: 'var(--foreground)' }}>
            What We Do
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-6 text-center hover:shadow-xl transition-all">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-primary)' }}>
                <Globe2 className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Global Coverage</h4>
              <p style={{ color: 'var(--text-secondary)' }}>
                Access news from leading publications across multiple countries and languages
              </p>
            </div>

            <div className="card p-6 text-center hover:shadow-xl transition-all">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-secondary)' }}>
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Real-Time Updates</h4>
              <p style={{ color: 'var(--text-secondary)' }}>
                Stay informed with continuously updated feeds from your favorite sources
              </p>
            </div>

            <div className="card p-6 text-center hover:shadow-xl transition-all">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-primary)' }}>
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Trusted Sources</h4>
              <p style={{ color: 'var(--text-secondary)' }}>
                Only the most reputable and verified news organizations
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose NewsHub */}
        <div>
          <h3 className="text-2xl font-bold mb-8 text-center" style={{ color: 'var(--foreground)' }}>
            Why Choose NewsHub
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start gap-4 p-4 rounded-lg transition-all hover:shadow-md" style={{ background: 'var(--background-elevated)' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent-primary)' }}>
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold mb-1" style={{ color: 'var(--foreground)' }}>Quality First</h4>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Curated sources ensure you get accurate, reliable information
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg transition-all hover:shadow-md" style={{ background: 'var(--background-elevated)' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent-secondary)' }}>
                <Eye className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold mb-1" style={{ color: 'var(--foreground)' }}>Ad-Free Experience</h4>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Clean, distraction-free reading focused on the news that matters
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg transition-all hover:shadow-md" style={{ background: 'var(--background-elevated)' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent-primary)' }}>
                <Grid3x3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold mb-1" style={{ color: 'var(--foreground)' }}>Smart Categories</h4>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Organized by topic for easy browsing and discovery
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg transition-all hover:shadow-md" style={{ background: 'var(--background-elevated)' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent-secondary)' }}>
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold mb-1" style={{ color: 'var(--foreground)' }}>Privacy Focused</h4>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Your reading habits stay private - no tracking or profiling
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg transition-all hover:shadow-md" style={{ background: 'var(--background-elevated)' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent-primary)' }}>
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold mb-1" style={{ color: 'var(--foreground)' }}>Beautiful Design</h4>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Modern, intuitive interface that makes reading a pleasure
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg transition-all hover:shadow-md" style={{ background: 'var(--background-elevated)' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent-secondary)' }}>
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold mb-1" style={{ color: 'var(--foreground)' }}>100% Free</h4>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  No subscriptions, no paywalls - completely free to use
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
